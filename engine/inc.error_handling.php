<?php

if (empty($ERROR_REPORTING_HIDE_ERRORS)) {
    error_reporting(E_ALL);
    @ini_set('display_errors', 1);
}
@trigger_error(''); 				// reset the error_get_last function
set_error_handler('errorHandler');	// for normal errors
ob_start('errorHandler_fatal');		// for fatal errors
errorHandler_setFatal(E_ALL ^ E_NOTICE ^ E_WARNING); // will die on any error except E_NOTICE

define('ERRORS_DIRNAME', $_SERVER['DOCUMENT_ROOT'] /* '/home/virtual/www/mccann/madara.hip.lv' */);

function errorHandler_fatal($buffer)
{
    $error = @error_get_last();
    if ($error && ($error['type'] & error_reporting()) && ($error['message'] != '')) {
        $err = errorHandler($error['type'], $error['message'], $error['file'], $error['line'], false, true);

        return $err ? $err : '???';
    } else {
        return $buffer;
    }
}

function errorHandler($errno, $errstr, $errfile, $errline, $context = false, $bDoReturn = false)
{
    global $logger;
    $errno = $errno & error_reporting();
    if ($errno == 0) {
        return;
    }

    if (! defined('E_STRICT')) {
        define('E_STRICT', 2048);
    }
    if (! defined('E_RECOVERABLE_ERROR')) {
        define('E_RECOVERABLE_ERROR', 4096);
    }

    $str = "<pre style=\"color:#c00\">\n<b>";
    $plain = '';
    switch ($errno) {
        case E_ERROR:               $str .= 'Error';
            $plain .= 'Error -';
            break;
        case E_WARNING:             $str .= 'Warning';
            $plain .= 'Warning -';
            break;
        case E_PARSE:               $str .= 'Parse Error';
            $plain .= 'Parse Error -';
            break;
        case E_NOTICE:              $str .= 'Notice';
            $plain .= 'Notice -';
            break;
        case E_CORE_ERROR:          $str .= 'Core Error';
            $plain .= 'Core Error -';
            break;
        case E_CORE_WARNING:        $str .= 'Core Warning';
            $plain .= 'Core Warning -';
            break;
        case E_COMPILE_ERROR:       $str .= 'Compile Error';
            $plain .= 'Compile Error -';
            break;
        case E_COMPILE_WARNING:     $str .= 'Compile Warning';
            $plain .= 'Compile Warning -';
            break;
        case E_USER_ERROR:          $str .= 'User Error';
            $plain .= 'User Error -';
            break;
        case E_USER_WARNING:        $str .= 'User Warning';
            $plain .= 'User Warning -';
            break;
        case E_USER_NOTICE:         $str .= 'User Notice';
            $plain .= 'User Notice -';
            break;
        case E_STRICT:              $str .= 'Strict Notice';
            $plain .= 'Strict Notice -';
            break;
        case E_RECOVERABLE_ERROR:   $str .= 'Recoverable Error';
            $plain .= 'Recoverable Error -';
            break;
        default:                    $str .= "Unknown error ($errno)";
            $plain .= "Unknown error ($errno) -";
            break;
    }

    $str .= ":</b> <i>$errstr</i> in <b>" . errorHandler_shortFile($errfile) . "</b> on line <b>$errline</b></pre>\n";
    $plain .= " $errstr in: " . errorHandler_shortFile($errfile) . ":$errline" . PHP_EOL;

    if (function_exists('debug_backtrace')) {
        $str .= '<!--';
        $backtrace = debug_backtrace();
        array_shift($backtrace);
        foreach ($backtrace as $i => $l) {
            $str .= "[$i] in function <b>" . (! empty($l['class']) ? $l['class'] : '') . (! empty($l['type']) ? $l['type'] : '') . $l['function'] . '</b>';
            if (! empty($l['file'])) {
                $str .= ' in <b>' . errorHandler_shortFile($l['file']) . '</b>';
            }
            if (! empty($l['line'])) {
                $str .= " on line <b>{$l['line']}</b>";
            }
            $str .= "\n";

            $plain .= "[$i] in" .
                      (! empty($l['class']) ? " method of {$l['class']}" : ' function') .
                      (! empty($l['type']) ? ' ' . $l['type'] : '') .
                      ' ' . $l['function'];

            if (! empty($l['file'])) {
                $plain .= ' in file ' . errorHandler_shortFile($l['file']);
            }

            if (! empty($l['line'])) {
                $plain .= ":{$l['line']}";
            }

            $plain .= PHP_EOL;
        }
        $str .= "-->\n";
        $plain .= '<--' . PHP_EOL;
    }

    if (! empty($logger)) {
        switch ($errno) {
            case E_NOTICE:
            case E_USER_NOTICE:
                $logger->notice($plain);
                break;
            case E_WARNING:
            case E_CORE_WARNING:
            case E_COMPILE_WARNING:
            case E_USER_WARNING:
                $logger->warning($plain);
                break;
            case E_ERROR:
            case E_USER_ERROR:
            case E_STRICT:
            case E_RECOVERABLE_ERROR:
                $logger->error($plain);
                break;
            case E_PARSE:
            case E_CORE_ERROR:
            case E_COMPILE_ERROR:
                $logger->critical($plain);
                break;
            default: $logger->error($plain);
        }
    }

    if ($bDoReturn) {
        return $str;
    } else {
        echo $str;
        if (isset($GLOBALS['error_fatal'])) {
            if ($GLOBALS['error_fatal'] & $errno) {
                exit('fatal');
            }
        }
    }
}

function errorHandler_setFatal($mask = null)
{
    if (! is_null($mask)) {
        $GLOBALS['error_fatal'] = $mask;
    } elseif (! isset($GLOBALS['die_on'])) {
        $GLOBALS['error_fatal'] = 0;
    }

    return $GLOBALS['error_fatal'];
}

function errorHandler_shortFile($filepath)
{
    if (strpos($filepath, ERRORS_DIRNAME) === 0) {
        $filepath = substr($filepath, strlen(ERRORS_DIRNAME));
    }

    return $filepath;
}
