<?php

namespace App\Shared;

abstract class BertaBaseModel implements \ArrayAccess, \Iterator
{
    private $position = 0;
    private $publicPropertyReflect;

    /**
     * Class constructor.
     */
    public function __construct($properties = [])
    {
        foreach ($this->getPublicPropertiesReflect() as $propertyReflect) {
            $propertyName = $propertyReflect->getName();
            if (isset($properties[$propertyName])) {
                $this->{$propertyName} = $properties[$propertyName];
            }
        }
    }

    public function toArray()
    {
        $result = [];
        foreach ($this->getPublicProperties() as $property) {
            if (is_null($this->{$property})) {
                continue;
            }
            $result[$property] = $this->{$property};
        }
        return $result;
    }

    /* ArrayAccess properties: */
    public function offsetSet($offset, $value)
    {
        if (is_null($offset)) {
            throw new \OutOfRangeException('Only known Model property can be set', 500);
        } elseif ($this->hasPublicProperty($offset)) {
            $this->{$offset} = $value;
        } else {
            throw new \OutOfRangeException('Only known Model property can be set', 500);
        }
    }

    public function offsetExists($offset)
    {
        return $this->hasPublicProperty($offset);
    }

    public function offsetUnset($offset)
    {
        if ($this->hasPublicProperty($offset)) {
            $this->{$offset} = null;
        }
    }

    public function offsetGet($offset)
    {
        return $this->hasPublicProperty($offset) ? $this->{$offset} : null;
    }

    /* Iterator properties */
    public function rewind()
    {
        $this->position = 0;
    }

    public function current()
    {
        $properties = $this->getPublicPropertiesReflect();
        return $this->{$properties[$this->position]->getName()};
    }

    public function key()
    {
        $properties = $this->getPublicPropertiesReflect();
        return $properties[$this->position]->getName();
    }

    public function next()
    {
        $this->position += 1;
    }

    public function valid()
    {
        $properties = $this->getPublicPropertiesReflect();
        return count($properties) > $this->position;
    }

    /* Other public methods */
    public static function getPublicProperties()
    {
        $classReflection = new \ReflectionClass(get_called_class());
        $propertiesReflected = $classReflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        return array_map(function ($propertyReflect) {
            return $propertyReflect->getName();
        }, $propertiesReflected);
    }

    /* Other private =methods */
    private function hasPublicProperty($propertyName)
    {
        $properties = $this->getPublicPropertiesReflect();
        foreach ($properties as $property) {
            if ($property->getName() === $propertyName) {
                return true;
            }
        }
        return false;
    }

    private function getPublicPropertiesReflect()
    {
        if (!isset($this->publicPropertyReflect)) {
            $reflection = new \ReflectionObject($this);
            $this->publicPropertyReflect = $reflection->getProperties(\ReflectionProperty::IS_PUBLIC);
        }
        return $this->publicPropertyReflect;
    }
}
