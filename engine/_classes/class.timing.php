<?php

class Timing {
	
	private $_points;
	
	function Timing() {
		$this->reset();
	}
	
	public function point($name = 'point') {
		array_push($this->_points, array($name, $this->microtime_float()));
	}
	
	public function reset() {
		$this->_points = array();
	}
	
	
	public function report($return = false) {
		$str = "\n\n<p>* Timing report *";
		$firstPoint = false;
		$prevPoint = false;
		foreach($this->_points as $point) {
			$str .= "<br />\n{$point[0]}:\t\t" . ($prevPoint ? round($point[1] - $prevPoint[1], 3) : 0) . ' s';
			$prevPoint = $point;
			if(!$firstPoint) $firstPoint = $point;
		}
		
		if($point) {
			$str .= "<br />\nTotal:\t\t" . round($point[1] - $firstPoint[1], 3) . ' s';
		}
		$str .= "</p>\n\n";
		
		$this->reset();
		
		if($return) {
			return $str;
		} else
			echo $str;
	}
	
	public function microtime_float() {
	    list($usec, $sec) = explode(" ", microtime());
	    return ((float)$usec + (float)$sec);
	}
	
	
}



?>