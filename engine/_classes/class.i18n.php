<?php

class I18n extends BertaBase
{

	static $translations;
	public $default_lang = 'en';

	function __construct()
	{
		$lang = self::$options['language'];
		if(file_exists(self::$options['ENGINE_ROOT'].'lang/'.$lang.'.php'))
		{
			self::$translations = include(self::$options['ENGINE_ROOT'].'lang/'.$lang.'.php');
		}
	}

	/**
	 * @param   string  $key
	 * @return  string
	 *
	 *
	 */
	public static function _($key)
	{
		if(!empty(self::$translations) && isset(self::$translations[$key]))
		{
			return self::$translations[$key];
		}

		return $key;
	}
}



?>