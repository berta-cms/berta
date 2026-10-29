<?php

namespace App\Configuration;

use App\User\UserModel;

/**
 * Checks a setting value against its definition from SiteSettingsConfigService or SiteTemplatesConfigService,
 * with the rules the editor applies (editor/src/app/sites/shared/setting.component.ts and
 * editor/src/app/inputs/validation.service.ts), so the server enforces them for every client:
 * settings needing a plan feature, the allowed values of selects, colors, and the text inputs' rules.
 * Formats the editor doesn't validate (url, longtext, richtext, files, editor actions) take any value.
 */
class SettingValueValidator
{
    /**
     * @param  list<string>|null  $features  the website's plan features; read from the account when needed if null
     */
    public function __construct(private ?array $features = null) {}

    /**
     * Why a value sent for a setting path can't be saved, or null when it can. Paths without a definition (e.g.
     * entries of list settings) and values that aren't text are left to the data service, as before.
     *
     * @param  mixed  $definition  the setting's definition, if the path has one
     */
    public function errorFor(mixed $value, mixed $definition): ?string
    {
        return is_array($definition) && is_scalar($value) ? $this->error(trim((string) $value), $definition) : null;
    }

    /**
     * Why the value can't be saved, or null when it can.
     *
     * @param  array<string, mixed>  $definition  the setting's definition
     */
    public function error(string $value, array $definition): ?string
    {
        if (isset($definition['requires_feature']) && ! in_array($definition['requires_feature'], $this->features ??= (new UserModel)->features, true)) {
            return "This setting needs the {$definition['requires_feature']} feature, which the website's plan doesn't include.";
        }

        return match ($definition['format'] ?? 'text') {
            'select', 'fontselect' => $this->selectError($value, $definition),
            'color' => $this->colorError($value, $definition),
            'text' => $this->textError($value, $definition),
            default => null,
        };
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function selectError(string $value, array $definition): ?string
    {
        $values = $definition['values'] ?? [];
        $allowed = array_map('strval', array_is_list($values) ? $values : array_keys($values));

        return in_array($value, $allowed, true) ? null : 'Use one of the allowed values: ' . implode(' | ', $allowed) . '.';
    }

    /**
     * The editor's color picker saves rgba(); stored values also use #hex and rgb().
     *
     * @param  array<string, mixed>  $definition
     */
    private function colorError(string $value, array $definition): ?string
    {
        if ($value === '') {
            return ! empty($definition['allow_blank']) ? null : 'This setting can\'t be empty.';
        }

        return preg_match('/^(#[0-9a-f]{3}|#[0-9a-f]{6}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\))$/i', $value)
            ? null
            : 'Use a color like #ff0000 or rgb(255,0,0).';
    }

    /**
     * The rules of the editor's text inputs (validation.service.ts).
     *
     * @param  array<string, mixed>  $definition
     */
    private function textError(string $value, array $definition): ?string
    {
        if ($value === '') {
            return ! empty($definition['allow_blank']) ? null : 'This setting can\'t be empty.';
        }

        if (! empty($definition['css_units']) && ! preg_match('/^-?\d*\.?\d+(px|em|rem|vw|vh|pt|%)$/', $value)) {
            return 'Use a number with a CSS unit: px, em, rem, vw, vh, pt or %.';
        }

        return match ($definition['validation'] ?? null) {
            'positive_integer' => preg_match('/^[1-9]\d*$/', $value) ? null : 'Use a positive whole number.',
            'zero_or_positive_integer' => preg_match('/^\d+$/', $value) ? null : 'Use zero or a positive whole number.',
            'positive_number' => preg_match('/^(?!0$)(?!0\d+$)\d*\.?\d+$/', $value) ? null : 'Use a positive number.',
            'email' => preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $value) ? null : 'Use a valid email address.',
            default => null,
        };
    }
}
