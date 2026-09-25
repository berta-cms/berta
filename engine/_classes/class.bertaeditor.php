<?php

class BertaEditor extends BertaContent
{
    public static function saveBlog($sName, &$blog)
    {
        if (empty($blog['@attributes'])) {
            $blog['@attributes'] = [];
        }
        if (empty($blog['@attributes']['section'])) {
            $blog['@attributes']['section'] = $sName;
        }

        $blog['@attributes']['last_upd_ver'] = self::$options['version'];

        $blogCopy = array_copy($blog);
        Array_XML::addCDATA($blogCopy);

        if ($xml = Array_XML::array2xml($blogCopy, 'blog')) {
            $xml_file = self::$options['XML_ROOT'] . str_replace('%', $sName, self::$options['blog.%.xml']);
            $fp = fopen($xml_file, 'w');
            if (flock($fp, LOCK_EX)) {
                fwrite($fp, $xml);
                @chmod($xml_file, 0666);
                flock($fp, LOCK_UN);
                fclose($fp);
            } else {
                throw new \Exception('Could not write locked file: ' . $xml_file);
            }

            return true;
        }
    }

    public static function getXEmpty($property)
    {
        return parent::getXEmpty($property);
    }

}
