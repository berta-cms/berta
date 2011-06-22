

Tempalte basics:
----------------

	Berta uses Smarty template engine
	
	http://www.smarty.net/
	
	Check their documentation for basic syntax:
	
	http://www.smarty.net/manual/en/smarty.for.designers.php


Berta's templates:
------------------

	A template in Berta is essentially a folder with the following structure:
	
		sometemplate/
			template.tpl		- the actual template file
			template.conf.php	- default settings
			style.css.php		- the stylesheet
			editor.css.php		- stylesheet which is additionally applied when
								  in "engine" environment
			plugins/			- folder that contains plugins used in the template
			
	Check out the actual templates for examples and clues how to build your own.
	
	The following material gives a brief summary of available variables inside
	the template file. There might be more variables available.


	
Global variables:
-----------------

	Examples:
	
	$siteHeading
	$siteFooter
	
	You can use your own custom global variables. No setup or configuration is needed, just
	write them in your template. Example:
	
		<h2 class="xEditable xProperty-someHeading">{ $someHeading }</h2>
		
	Global variables are global only when they are outside the entry loop. Otherwise they are
	considered as entry variables.


		
Entry variables:
----------------

	Entry variables are available inside entry cycle / xhtml
	
		<div class="xEntriesList xSection-{ $berta.section } xTag-{ $berta.tag }">
		{ foreach from=$entries key="entryId" item="entry" name="entriesLoop" }
		...
		{ /foreach }
		</div>
		
	Each entry has it's predefined variables:
	
		$entry.id			- numeric ID of this entry
		$entry.uniqid		- unique identifier (consisting of letters and numbers)
		$entry.date			- entry's date DD.MM.YYYY HH:MM:SS
		$entry.tags			- an array (key => value) of entry's tags
			key is the uniform name of the tag
			value is the tag itself
		
		$entry.mediafolder	- name of the folder where the media for this entry is stored.
		
	Commonly used custom entry variables:
	
		$entry.title
		$entry.description
		$entry.url
		
	You can use your own custom entry variables. Example:
	
		<div class="xEditable xProperty-introText">{ $entry.introText }</div>
		
	The form is very similar to the form in which global variables are written.
	Only in this case the definition is written inside the entry loop, so Berta
	will consider it as entry variable and store it as such.
	
	
	
	
Settings and system variables:
------------------------------

	$berta - array of berta's assigned variables
		
		
		$berta.environment - either "engine" or "site"
		$berta.templateName - the name of the current template
		
		$berta.css - the header stylesheets (mandatory inclusion in template)
		$berta.scripts - the header scripts (mandatory inclusion in template)
		
		$berta.settings	- a multidimensional array (categories/items) of site-wide settings
			the most common categories of the settings include:
			$berta.settings.texts
				$berta.settings.texts.ownerName
				$berta.settings.texts.pageTitle
				$berta.settings.texts.metaDescription
				$berta.settings.texts.metaKeywords
	
		$berta.sectionName - the name of the current section
		$berta.sections - array (key => value) of sections
			key kontains the uniform name of the section
			each value is and array of the following keys:
				name - the uniform name of the section
				title - the title
				has_direct_content - a boolean indicating whether there are entries in this section
					not attached to any subsection
		
		$berta.subSectionName
		$berta.subSections - array (key => value) of sections
			key kontains the uniform name of the section
			each value is and array of the following keys:
				name - the uniform name of the section
				title - the title
				tags_behavior - "all", "invisible" or "default_tag"
				default_tag - the name of the tag in case tags_behavior is "default_tag"
		
		$berta.tagName - the name of the currently selected tag
		$berta.tags - array (key => value) of tags for the current section 
			key is the uniform name of the tag
			value is the tag itself
		
	$entries - the entries for the selected section / subsection
	
	

Modifiers:
----------

	Modifiers change variable output. A modifier is written after a variable:

		$variable|modifier 
	
	If the variable is an array, and you want to apply the modifier to the whole array, then write:

		$array_variable|@modifier
	
	Modifier examples:

		$siteHeading|htmlspecialchars

			htmlspecialchars - formats variable to be displayed correctly in HTML context. 
							   anything of the variable's content that might look like HTML, 
							   will be converted to text.
						
		$entry.tags|@count
		
			count - counts the number of elements in an array

	
	
	
Plugins:
--------

	Plugins are PHP functions that can do some advanced processing of the template variables
	See Smarty's documentation on plugins at http://www.smarty.net/manual/en/plugins.php
	
	Berta supports:
		Template Functions
		Modifiers
		Block Functions
		
	So you can write your own modifiers, for example. See plugins folder of the "default" template 
	for examples.
	
	
			
--------------------------------------------------------------------------------------------------------------

(c) Berta
