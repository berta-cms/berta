<?php

namespace App\Setup;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ServerRequirementsController extends Controller
{
    /**
     * Server requirements are reported only before Berta is installed, so server
     * details are not exposed to the public afterwards.
     */
    public function index(ServerRequirementsService $service): JsonResponse
    {
        if ($service->isInstalled()) {
            return response()->json([
                'installed' => true,
                'requirements' => [],
            ]);
        }

        return response()->json([
            'installed' => false,
            'requirements' => $service->check(),
        ]);
    }
}
