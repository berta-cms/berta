<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Agents
    |--------------------------------------------------------------------------
    |
    | CLAUDE.md only imports AGENTS.md, so Claude Code's guidelines are written
    | to AGENTS.md together with the other agents' instead of being appended
    | to CLAUDE.md a second time. The remaining Boost options keep the
    | package defaults.
    |
    */

    'agents' => [
        'claude_code' => [
            'guidelines_path' => 'AGENTS.md',
        ],
    ],

];
