<?php

use Laravel\Lumen\Testing\DatabaseTransactions;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->get('/v1/meta');

        $this->assertEquals(
            $this->response->getStatusCode(), 200
        );
    }
}
