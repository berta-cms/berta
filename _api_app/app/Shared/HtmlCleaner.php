<?php

namespace App\Shared;

use Dom\Element;
use Dom\HTMLDocument;

/**
 * Removes what can run scripts from HTML written for a page, as the editor's rich text field does (TinyMCE with
 * scripts disabled): script elements, event handler attributes, iframe documents (srcdoc) and javascript: links.
 * Everything else stays, also forms and iframe embeds, which entries use for shop buttons and videos.
 * Scripts belong in the code settings that need the custom_javascript feature.
 */
class HtmlCleaner
{
    /**
     * Attributes that hold a link a browser may follow or load.
     */
    private const URL_ATTRIBUTES = ['href', 'src', 'action', 'formaction', 'data', 'poster', 'background', 'cite', 'xlink:href'];

    /**
     * The HTML without what can run scripts. HTML with nothing to remove is returned unchanged.
     */
    public function clean(string $html): string
    {
        if (trim($html) === '') {
            return $html;
        }

        $document = HTMLDocument::createFromString('<!DOCTYPE html><body>' . $html, LIBXML_NOERROR);
        $removed = false;

        foreach ($document->body->querySelectorAll('script') as $script) {
            $script->remove();
            $removed = true;
        }

        foreach ($document->body->querySelectorAll('*') as $element) {
            $removed = $this->cleanAttributes($element) || $removed;
        }

        return $removed ? $document->body->innerHTML : $html;
    }

    /**
     * Removes the element's attributes that can run scripts; true when any was removed.
     */
    private function cleanAttributes(Element $element): bool
    {
        $unsafe = [];

        foreach ($element->attributes as $attribute) {
            $name = strtolower($attribute->name);

            if (str_starts_with($name, 'on') || $name === 'srcdoc' || (in_array($name, self::URL_ATTRIBUTES, true) && $this->isScriptUrl($attribute->value))) {
                $unsafe[] = $attribute->name;
            }
        }

        foreach ($unsafe as $name) {
            $element->removeAttribute($name);
        }

        return $unsafe !== [];
    }

    /**
     * Whether a link runs a script. Browsers ignore whitespace and control characters in the scheme.
     */
    private function isScriptUrl(string $url): bool
    {
        $scheme = strtolower((string) preg_replace('/[\x00-\x20]+/', '', $url));

        return str_starts_with($scheme, 'javascript:') || str_starts_with($scheme, 'vbscript:');
    }
}
