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

    public static function getSettingsItemEditHTML($property, $sDef, $value, $additionalParams = null, $tag = 'div', $path = '')
    {
        global $editsForSettings;

        $pStr = '';
        if ($additionalParams) {
            foreach ($additionalParams as $pN => $p) {
                $pStr .= $pN . (! is_null($p) ? ('-' . $p) : '') . ' ';
            }
        }
        $html = '';

        if (! empty($sDef['html_before'])) {
            $html .= $sDef['html_before'];
        }

        $html .= '<' . $tag . ' class="value ' . (! empty($editsForSettings[$sDef['format']]) ? $editsForSettings[$sDef['format']] : '') . ' ' .
            'xProperty-' . $property . ' ' .
            (empty($sDef['html_entities']) ? 'xNoHTMLEntities' : '') . ' ' .
            'xCSSUnits-' . (empty($sDef['css_units']) ? '0' : '1') . ' ' .
            (empty($sDef['link']) ? '' : 'xLink') . ' ' .
            'xRequired-' . (! empty($sDef['allow_blank']) ? '0' : '1') . ' ' .
            (! empty($sDef['validator']) ? 'xValidator-' . $sDef['validator'] . ' ' : '') .
            $pStr .
            '" title="' . htmlspecialchars($sDef['default'] ?? '') . '"';

        if (! empty($path)) {
            $html .= ' data-path="' . $path . '"';
        }

        if ($sDef['format'] == 'select' || $sDef['format'] == 'fontselect') {
            $values = [];
            if ($sDef['values'] == 'templates') {
                $values = BertaTemplate::getAllTemplates();
            } else {
                foreach ($sDef['values'] as $vK => $vV) {
                    $values[$vK] = is_string($vK) ? ($vK . '|' . $vV) : $vV;
                }
            }
            $html .= ' x_options="' . htmlspecialchars(implode('||', $values)) . '"';
            $value = isset($values[$value]) && ! intval($value) > 0 ? $sDef['values'][$value] : $value;
        }

        $html .= '>';
        $html .= $value . '</' . $tag . '>';

        if (! empty($sDef['html_after'])) {
            $html .= $sDef['html_after'];
        }

        return $html;
    }
}
