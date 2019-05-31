<?php

class BertaUtils extends BertaBase
{
    // MULTIBYTE STRING TRANSLITERATOR / CANONIZER
    public static function canonizeString($tagTitle, $replacementStr = '-', $allowNonWordChars = '', $reallyRemoveOtherChars = false)
    {
        $char_map = [
            // Latin
            'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C',
            'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I',
            'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O',
            'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH',
            'ß' => 'ss',
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c',
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i',
            'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o',
            'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th',
            'ÿ' => 'y',

            // Latin symbols
            '©' => '(c)',

            // Greek
            'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
            'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
            'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
            'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
            'Ϋ' => 'Y',
            'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
            'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
            'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
            'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
            'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',

            // Turkish
            'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
            'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g',

            // Russian
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
            'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
            'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
            'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
            'Я' => 'Ya',
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
            'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
            'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
            'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
            'я' => 'ya',

            // Ukrainian
            'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
            'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',

            // Czech
            'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U',
            'Ž' => 'Z',
            'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
            'ž' => 'z',

            // Polish
            'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z',
            'Ż' => 'Z',
            'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
            'ż' => 'z',

            // Latvian
            'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N',
            'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
            'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
            'š' => 's', 'ū' => 'u', 'ž' => 'z',

            //Lithuanian
            'Ą' => 'A', 'Ę' => 'E', 'Ė' => 'E', 'Į' => 'I', 'Ų' => 'U',
            'ą' => 'a', 'ę' => 'e', 'ė' => 'e', 'į' => 'i', 'ų' => 'u',

            //Other
            'ɗ' => 'd', 'ə' => 'e', 'ʍ' => 'm', 'ş' => 's', 'ţ' => 't',
            'Ɗ' => 'D', 'Ə' => 'E', 'Ş' => 'S', 'Ţ' => 'T',
        ];

        $tagTitle = str_replace(array_keys($char_map), $char_map, $tagTitle);

        // replace all other characters with the replacement string
        if ($reallyRemoveOtherChars) {
            $tagTitle = preg_replace('/([^a-zA-Z0-9' . $allowNonWordChars . '])+/', $replacementStr, $tagTitle);
        } else {
            $tagTitle = mb_ereg_replace("[^\w$allowNonWordChars]", $replacementStr, $tagTitle);
        }

        //no duplicates
        $tagTitle = mb_ereg_replace("[$replacementStr]{2,}", $replacementStr, $tagTitle);

        // convert .- to .
        $tagTitle = str_replace('.' . $replacementStr, '.', $tagTitle);

        // remove . from the beinning and the end
        if (mb_substr($tagTitle, 0, 1) == '.') {
            $tagTitle = mb_substr($tagTitle, 1);
        }

        if (mb_substr($tagTitle, mb_strlen($tagTitle) - 1, 1) == '.') {
            $tagTitle = mb_substr($tagTitle, 0, mb_strlen($tagTitle) - 1);
        }

        // remove replacement strings from the beginning and the end
        if (mb_substr($tagTitle, 0, 1) == $replacementStr) {
            $tagTitle = mb_substr($tagTitle, 1);
        }

        if (mb_substr($tagTitle, mb_strlen($tagTitle) - 1, 1) == $replacementStr) {
            $tagTitle = mb_substr($tagTitle, 0, mb_strlen($tagTitle) - 1);
        }

        return $tagTitle;
    }

    // credit to Maxim Chernyak
    // http://mediumexposure.com/techblog/smart-image-resizing-while-preserving-transparency-php-and-gd-library
    public static function smart_resize_image(
        $file,
        $width = 0,
        $height = 0,
        $proportional = false,
        $output = 'file',
        $delete_original = true,
        $use_linux_commands = false
    ) {
        if ($height <= 0 && $width <= 0) {
            return false;
        }

        // Setting defaults and meta
        $info = getimagesize($file);
        $image = '';
        $final_width = 0;
        $final_height = 0;
        list($width_old, $height_old) = $info;

        // Calculating proportionality
        if ($proportional) {
            if ($width == 0) {
                $factor = $height / $height_old;
            } elseif ($height == 0) {
                $factor = $width / $width_old;
            } else {
                $factor = min($width / $width_old, $height / $height_old);
            }

            $final_width = round($width_old * $factor);
            $final_height = round($height_old * $factor);
        } else {
            $final_width = round(($width <= 0) ? $width_old : $width);
            $final_height = round(($height <= 0) ? $height_old : $height);
        }

        // Loading image to memory according to type
        switch ($info[2]) {
            case IMAGETYPE_GIF:$image = imagecreatefromgif($file);
                break;
            case IMAGETYPE_JPEG:$image = imagecreatefromjpeg($file);
                break;
            case IMAGETYPE_PNG:$image = imagecreatefrompng($file);
                break;
            default:return false;
        }

        // Don't resize animated gifs
        if ($info[2] == IMAGETYPE_GIF && BertaUtils::is_animated($file)) {
            $image_resized = imagecreatefromgif($file);
        } else {
            // This is the resizing/resampling/transparency-preserving magic
            $image_resized = imagecreatetruecolor($final_width, $final_height);
            if (($info[2] == IMAGETYPE_GIF) || ($info[2] == IMAGETYPE_PNG)) {
                $transparency = imagecolortransparent($image);

                if ($transparency >= 0) {
                    $transparent_color = @imagecolorsforindex($image, $transparency); // for animated gifs sometimes error is thrown :(
                    $transparency = imagecolorallocate($image_resized, $transparent_color['red'], $transparent_color['green'], $transparent_color['blue']);
                    imagefill($image_resized, 0, 0, $transparency);
                    imagecolortransparent($image_resized, $transparency);
                } elseif ($info[2] == IMAGETYPE_PNG) {
                    imagealphablending($image_resized, false);
                    $color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
                    imagefill($image_resized, 0, 0, $color);
                    imagesavealpha($image_resized, true);
                }
            }
            imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
        }

        // Taking care of original, if needed
        if ($delete_original) {
            if ($use_linux_commands) {
                exec('rm ' . $file);
            } else {
                @unlink($file);
            }
        }

        // Preparing a method of providing result
        switch (strtolower($output)) {
            case 'browser':
                $mime = image_type_to_mime_type($info[2]);
                header("Content-type: $mime");
                $output = null;
                break;
            case 'file':
                $output = $file;
                break;
            case 'return':
                return $image_resized;
                break;
            default:
                break;
        }

        // Writing image according to type to the output destination
        switch ($info[2]) {
            case IMAGETYPE_GIF:imagegif($image_resized, $output);
                break;
            case IMAGETYPE_JPEG:imagejpeg($image_resized, $output, 97);
                break;
            case IMAGETYPE_PNG:imagepng($image_resized, $output);
                break;
            default:return false;
        }

        return true;
    }

    public static function is_animated($filename)
    {
        if (!($fh = @fopen($filename, 'rb'))) {
            return false;
        }
        $count = 0;
        //an animated gif contains multiple "frames", with each frame having a
        //header made up of:
        // * a static 4-byte sequence (\x00\x21\xF9\x04)
        // * 4 variable bytes
        // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)

        // We read through the file til we reach the end of the file, or we've found
        // at least 2 frame headers
        while (!feof($fh) && $count < 2) {
            $chunk = fread($fh, 1024 * 100); //read 100kb at a time
            $count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
        }
        fclose($fh);

        return $count > 1;
    }

    public static function db()
    {
        $db = false;
        $options = self::$options;
        $dbName = 'site.db';
        $dbPath = $options['XML_ROOT'] . $dbName;
        touch($dbPath);
        try {
            $db = new PDO('sqlite:' . $dbPath);
        } catch (PDOException $e) {
            echo $e->getMessage();
            die();
        }
        return $db;
    }

    //log events in sqlite
    public static function logEvent($action = '')
    {
        $options = self::$options;

        if ($options['HOSTING_PROFILE']) {
            $db = BertaUtils::db();
            $db->exec('
                CREATE TABLE IF NOT EXISTS `log` (
                  `id` INTEGER PRIMARY KEY,
                  `created_at` datetime NOT NULL,
                  `action` varchar(20) NOT NULL,
                  `get` text NOT NULL,
                  `post` text NOT NULL
                )
            ');

            $q = $db->prepare('INSERT INTO log VALUES (NULL, :created_at, :action, :get, :post)') or die(print_r($db->errorInfo(), true));
            $q->execute(
                [
                    ':created_at' => date('Y-m-d H:i:s'),
                    ':action' => $action,
                    ':get' => serialize($_GET),
                    ':post' => serialize($_POST),
                ]
            );

            //send stats to server
            if ($action == 'before update' || $action == 'login') {
                $data = [
                    'session_id' => session_id(),
                    'host' => $_SERVER['HTTP_HOST'],
                    'action' => $action,
                ];
                $url = 'http://hosting.berta.me/stats';
                $ch = curl_init();
                $timeout = 30;
                curl_setopt($ch, CURLOPT_URL, $url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
                curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
                curl_exec($ch);
                curl_close($ch);
            }
        }
    }
}
