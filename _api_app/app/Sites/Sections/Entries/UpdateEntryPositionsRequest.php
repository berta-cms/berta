<?php

namespace App\Sites\Sections\Entries;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateEntryPositionsRequest extends FormRequest
{
    /**
     * Entries keep room above them for their hover toolbar in the editor.
     */
    public const MIN_TOP = 20;

    public function rules(): array
    {
        return [
            // The default site's slug is an empty string, which arrives as null.
            'site' => ['present', 'nullable', 'string'],
            'section' => ['required', 'string'],
            'positions' => ['required', 'array', 'min:1'],
            'positions.*.id' => ['required', 'integer'],
            'positions.*.value' => ['required', 'string', 'regex:/^-?\d+,-?\d+$/'],
        ];
    }

    /**
     * Rejects positions that would put an entry off screen, where it can no
     * longer be reached to drag it back. A fixed entry's left isn't bounded:
     * in a centered layout it's stored relative to the content container, so
     * a negative value can still be on screen depending on the window width.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $fixedEntryIds = $this->fixedEntryIds();

                foreach ($this->input('positions') as $index => $position) {
                    [$left, $top] = array_map('intval', explode(',', $position['value']));
                    $isFixed = in_array((string) $position['id'], $fixedEntryIds, true);

                    if ($top < self::MIN_TOP || (! $isFixed && $left < 0)) {
                        $validator->errors()->add(
                            "positions.{$index}.value",
                            "The position of entry {$position['id']} is off screen.",
                        );
                    }
                }
            },
        ];
    }

    /**
     * @return array<int, string>
     */
    private function fixedEntryIds(): array
    {
        $entries = (new SectionEntriesDataService($this->input('site') ?? '', $this->input('section')))->get();

        return collect($entries['entry'])
            ->filter(fn (array $entry): bool => ($entry['content']['fixed'] ?? '') === '1')
            ->map(fn (array $entry): string => (string) $entry['id'])
            ->values()
            ->all();
    }
}
