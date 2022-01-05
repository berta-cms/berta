<?php

namespace App\Sites\Sections;

class SitemapRenderService
{
    private function getTags($sectionTags)
    {
        $tags = array_filter($sectionTags['section'], function ($section) {
            return !empty($section['tag']);
        });

        $tags = array_reduce($tags, function ($sections, $section) {
            $sections[$section['@attributes']['name']] = array_map(function ($tag) use ($section) {
                return $tag['@attributes']['name'];
            }, $section['tag']);
            return $sections;
        }, []);

        return $tags;
    }

    private function getUrl($section, $siteSlug, $sections, $request, $tag = null)
    {
        $urlParts = [];

        if (!empty($siteSlug)) {
            $urlParts['site'] = $siteSlug;
        }

        $isFirstSection = $section['name'] == $sections[0]['name'];

        if (!$isFirstSection || $tag) {
            $urlParts['section'] = $section['name'];
        }

        if ($tag) {
            $urlParts['tag'] = $tag;
        }

        $host = $request->getHost();
        $scheme = $request->getScheme();

        return "{$scheme}://{$host}/" . implode('/', $urlParts);
    }

    private function getViewData(
        $request,
        $siteSlug,
        $sections,
        $sectionTags
    ) {
        $tags = $this->getTags($sectionTags);

        // Filter sections
        $availableSections = array_filter($sections, function ($section) {
            $isPublished = $section['@attributes']['published'] == '1';
            $isEmptyTitle = empty($section['title']);
            $isCartSection = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'shopping_cart';
            return $isPublished && !$isEmptyTitle && !$isCartSection;
        });

        $availableSections = array_map(function ($section) use ($tags, $siteSlug, $sections) {
            $section['tags'] = !empty($tags[$section['name']]) ? $tags[$section['name']] : [];
            return $section;
        }, $availableSections);

        $urls = array_reduce($availableSections, function ($urls, $section) use ($request, $siteSlug, $sections) {
            $isExternalLink = isset($section['@attributes']['type']) && $section['@attributes']['type'] == 'external_link';
            if ($isExternalLink && !empty($section['link'])) {
                array_push($urls, $section['link']);
                return $urls;
            }

            $urls[] = $this->getUrl($section, $siteSlug, $sections, $request, null);
            $hasDirectContent = !empty($section['@attributes']['has_direct_content']) && $section['@attributes']['has_direct_content'];
            foreach ($section['tags'] as $i => $tag) {
                if (!$hasDirectContent && !$i) {
                    continue;
                }
                $urls[] = $this->getUrl($section, $siteSlug, $sections, $request, $tag);
            }

            return $urls;
        }, []);

        return [
            'urls' => $urls
        ];
    }

    public function render(
        $request,
        $siteSlug,
        $sections,
        $sectionTags
    ) {
        $data = $this->getViewData(
            $request,
            $siteSlug,
            $sections,
            $sectionTags
        );

        return view('Sites/Sections/sitemap', $data);
    }
}
