<?php

/* uzlabota: ernesto */

/******
** CleanURL
** Make your URLs User & Google friendly
** Version 0.9
******
** Author: Huda M Elmatsani
** Email: 	justhuda ** netscape ** net
**
** 2/Nov/2004
******
** Copyright (c) 2004 Huda M Elmatsani All rights reserved.
** This program is free for any purpose use.
********
**
** Splits a clean (rewritten) URL like news/120/2 into its parts:
**  $clean = new CleanURL;
**  $clean->parseURL($urlStr);
**  $clean->getParts(2); // ['120', '2']
**
************/

class CleanURL
{
    public $parts;

    public function parseURL($urlStr = '')
    {
        /* grab URL query string and script name */
        if (! $urlStr) {
            $urlStr = $_SERVER['REQUEST_URI'];
        }

        $uri = strpos($urlStr, '?') !== false ? substr($urlStr, 0, strpos($urlStr, '?')) : $urlStr;
        $script = $_SERVER['SCRIPT_NAME'];
        /* get extension */
        $scriptArr = explode('.', $script);
        $ext = end($scriptArr);

        /* if extension is found in URL, eliminate it */
        if (strstr($uri, '.')) {
            $arr_uri = explode('.', $uri);
            /* get last part */
            $last = end($arr_uri);

            if ($last == $ext) {
                array_pop($arr_uri);
                $uri = implode('.', $arr_uri);
            }
        }

        /* pick the name without extension */
        $basename = basename($script, '.' . $ext);
        /* slicing query string */
        $temp = explode('/', $uri);
        $key = array_search($basename, $temp);
        $parts = array_slice($temp, $key + 1);
        $this->parts = $parts;
    }

    /**
     * Return the given number of URL parts according to $limit parameter.
     * Fills non existing parts with boolean value `false`.
     *
     * @param {number} [$limit = 0] - The number of URL parts to return. If 0 is unlimited.
     * @return {array<string|boolean>}
     */
    public function getParts($limit = 0)
    {
        /* return array of sliced query string */
        if (! $limit) {
            return $this->parts;
        }
        $urlParts = [];
        for ($i = 0; $i < $limit; $i++) {
            $urlParts[$i] = empty($this->parts[$i]) ? false : $this->parts[$i];
        }

        return $urlParts;
    }
}
