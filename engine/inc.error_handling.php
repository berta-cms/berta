<?




//echo errorHandler('2048', 'aaa', 'bbb', 30, false, true);
//echo 'aaa';


if(empty($ERROR_REPORTING_HIDE_ERRORS)) {
	error_reporting(E_ALL);
	@ini_set("display_errors", 1);
}
@trigger_error(""); 				// reset the error_get_last function
set_error_handler('errorHandler');	// for normal errors
ob_start("errorHandler_fatal");		// for fatal errors
errorHandler_setFatal(E_ALL^E_NOTICE^E_WARNING); // will die on any error except E_NOTICE

define('ERRORS_DIRNAME', $_SERVER['DOCUMENT_ROOT'] /*'/home/virtual/www/mccann/madara.hip.lv'*/);





function errorHandler_fatal($buffer) {
	/*if (ereg("(error</b>:)(.+)(<br)", $buffer, $regs) ) {
	    $err = preg_replace("/<.*?>/","",$regs[2]);
	    error_log($err);
	    return "ERROR CAUGHT check log file";
	  }
	  return $buffer;*/
	$error = @error_get_last();
	if($error && ($error['type'] & error_reporting()) && ($error['message'] != "")) {
		//  return ($error['message'] == "") . ', ' . $error['type'] . ' [' . $error['message'] . '] ' . $error['file']. ' ' . $error['line'] . '; ';
	    $err = errorHandler($error['type'], $error['message'], $error['file'], $error['line'], false, true);
		return $err ? $err : '???';
	} else
		return $buffer;
	
}

function errorHandler($errno, $errstr, $errfile, $errline, $context = false, $bDoReturn = false) {
    $errno = $errno & error_reporting();
	if($errno == 0) return;
	
    if(!defined('E_STRICT'))            define('E_STRICT', 2048);
    if(!defined('E_RECOVERABLE_ERROR')) define('E_RECOVERABLE_ERROR', 4096);
    
	$str = "<pre style=\"color:#c00\">\n<b>";
    switch($errno){
        case E_ERROR:               $str .= "Error";                  break;
        case E_WARNING:             $str .= "Warning";                break;
        case E_PARSE:               $str .= "Parse Error";            break;
        case E_NOTICE:              $str .= "Notice";                 break;
        case E_CORE_ERROR:          $str .= "Core Error";             break;
        case E_CORE_WARNING:        $str .= "Core Warning";           break;
        case E_COMPILE_ERROR:       $str .= "Compile Error";          break;
        case E_COMPILE_WARNING:     $str .= "Compile Warning";        break;
        case E_USER_ERROR:          $str .= "User Error";             break;
        case E_USER_WARNING:        $str .= "User Warning";           break;
        case E_USER_NOTICE:         $str .= "User Notice";            break;
        case E_STRICT:              $str .= "Strict Notice";          break;
        case E_RECOVERABLE_ERROR:   $str .= "Recoverable Error";      break;
        default:                    $str .= "Unknown error ($errno)"; break;
    }
    
	$str .= ":</b> <i>$errstr</i> in <b>"  . errorHandler_shortFile($errfile) . "</b> on line <b>$errline</b></pre>\n";
	
    if(function_exists('debug_backtrace')){
        //print "backtrace:\n";
		$str .= '<!--';
        $backtrace = debug_backtrace();
        array_shift($backtrace);
        foreach($backtrace as $i=>$l){
            $str .= "[$i] in function <b>" . (!empty($l['class']) ? $l['class'] : '') . (!empty($l['type']) ? $l['type'] : '') . $l['function'] . '</b>';
            if(!empty($l['file'])) $str .= " in <b>" . errorHandler_shortFile($l['file']) . '</b>';
            if(!empty($l['line'])) $str .= " on line <b>{$l['line']}</b>";
            $str .= "\n";
        }
		$str .= "-->\n";
    }
    //$str .= "\n</pre>";

	if($bDoReturn) {
		return $str;
		
	} else {
		echo $str;
		if(isset($GLOBALS['error_fatal'])) {
        	if($GLOBALS['error_fatal'] & $errno) die('fatal');
		}
    }
}

function errorHandler_setFatal($mask = NULL){
    if(!is_null($mask)){
        $GLOBALS['error_fatal'] = $mask;
    }elseif(!isset($GLOBALS['die_on'])){
        $GLOBALS['error_fatal'] = 0;
    }
    return $GLOBALS['error_fatal'];
}

function errorHandler_shortFile($filepath) {
	if(strpos($filepath, ERRORS_DIRNAME) === 0) $filepath = substr($filepath, strlen(ERRORS_DIRNAME));
	return $filepath;
}









/*$cfg = array();
$cfg['debug'] = 1;
$cfg['adminEmail'] = 'name@domain.tld';



function errorHandler($errno, $errstr='', $errfile='', $errline='')
{
    // if error has been supressed with an @
    if (error_reporting() == 0) {
        return;
    }

    global $cfg;

    // check if function has been called by an exception
    if(func_num_args() == 5) {
        // called by trigger_error()
        $exception = null;
        list($errno, $errstr, $errfile, $errline) = func_get_args();

        $backtrace = array_reverse(debug_backtrace());

    }else {
        // caught exception
        $exc = func_get_arg(0);
        $errno = $exc->getCode();
        $errstr = $exc->getMessage();
        $errfile = $exc->getFile();
        $errline = $exc->getLine();

        $backtrace = $exc->getTrace();
    }

    $errorType = array (
               E_ERROR            => 'ERROR',
               E_WARNING        => 'WARNING',
               E_PARSE          => 'PARSING ERROR',
               E_NOTICE         => 'NOTICE',
               E_CORE_ERROR     => 'CORE ERROR',
               E_CORE_WARNING   => 'CORE WARNING',
               E_COMPILE_ERROR  => 'COMPILE ERROR',
               E_COMPILE_WARNING => 'COMPILE WARNING',
               E_USER_ERROR     => 'USER ERROR',
               E_USER_WARNING   => 'USER WARNING',
               E_USER_NOTICE    => 'USER NOTICE',
               E_STRICT         => 'STRICT NOTICE',
               E_RECOVERABLE_ERROR  => 'RECOVERABLE ERROR'
               );

    // create error message
    if (array_key_exists($errno, $errorType)) {
        $err = $errorType[$errno];
    } else {
        $err = 'CAUGHT EXCEPTION';
    }

    $errMsg = "$err: $errstr in $errfile on line $errline";

    // start backtrace
    foreach ($backtrace as $v) {

        if (isset($v['class'])) {

            $trace = 'in class '.$v['class'].'::'.$v['function'].'(';

            if (isset($v['args'])) {
                $separator = '';

                foreach($v['args'] as $arg ) {
                    $trace .= "$separator".getArgument($arg);
                    $separator = ', ';
                }
            }
            $trace .= ')';
        }

        elseif (isset($v['function']) && empty($trace)) {
            $trace = 'in function '.$v['function'].'(';
            if (!empty($v['args'])) {

                $separator = '';

                foreach($v['args'] as $arg ) {
                    $trace .= "$separator".getArgument($arg);
                    $separator = ', ';
                }
            }
            $trace .= ')';
        }
    }

    // display error msg, if debug is enabled
    if($cfg['debug'] == 1) {
        echo '<h2>Debug Msg</h2>'.nl2br($errMsg).'<br />
            Trace: '.nl2br($trace).'<br />';
    }

    // what to do
    switch ($errno) {
        case E_NOTICE:
        case E_USER_NOTICE:
            return;
            break;

        default:
            if($cfg['debug'] == 0){
                // send email to admin
                if(!empty($cfg['adminEmail'])) {
                    @mail($cfg['adminEmail'],'critical error on '.$_SERVER['HTTP_HOST'], $errorText,
                            'From: Error Handler');
                }
                // end and display error msg
                exit(displayClientMessage());
            }
            else
                exit('<p>aborting.</p>');
            break;

    }

} // end of errorHandler()

function displayClientMessage()
{
    echo 'some html page with error message';

}

function getArgument($arg)
{
    switch (strtolower(gettype($arg))) {

        case 'string':
            return( '"'.str_replace( array("\n"), array(''), $arg ).'"' );

        case 'boolean':
            return (bool)$arg;

        case 'object':
            return 'object('.get_class($arg).')';

        case 'array':
            $ret = 'array(';
            $separtor = '';

            foreach ($arg as $k => $v) {
                $ret .= $separtor.getArgument($k).' => '.getArgument($v);
                $separtor = ', ';
            }
            $ret .= ')';

            return $ret;

        case 'resource':
            return 'resource('.get_resource_type($arg).')';

        default:
            return var_export($arg, true);
    }
}*/

?>