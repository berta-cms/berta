<?php

use App\Plugins\AiAssistant\AiAssistantQuotaService;
use App\Plugins\AiAssistant\AssistantAgent;
use App\User\UserModel;
use Illuminate\Support\Facades\Cache;

$pluginInstalled = class_exists(AssistantAgent::class);

function makeUser(int $plan, array $plans = []): UserModel
{
    $user = Mockery::mock(UserModel::class)->makePartial();
    $user->shouldReceive('getPlan')->andReturn($plan);
    $user->plans = $plans ?: [
        ['id' => '1', 'name' => 'Basic', 'features' => [], 'limits' => ['ai_assistant_daily' => 30]],
        ['id' => '2', 'name' => 'Pro', 'features' => [], 'limits' => ['ai_assistant_daily' => 100]],
        ['id' => '3', 'name' => 'Shop', 'features' => [], 'limits' => ['ai_assistant_daily' => 100]],
    ];

    return $user;
}

it('returns 30 requests per day for basic plan', function () {
    $service = new AiAssistantQuotaService;

    expect($service->getDailyLimit(makeUser(1)))->toBe(30);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns 100 requests per day for pro plan', function () {
    $service = new AiAssistantQuotaService;

    expect($service->getDailyLimit(makeUser(2)))->toBe(100);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns 100 requests per day for shop plan', function () {
    $service = new AiAssistantQuotaService;

    expect($service->getDailyLimit(makeUser(3)))->toBe(100);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns 0 when plan has no ai_assistant_daily limit configured', function () {
    $service = new AiAssistantQuotaService;
    $user = makeUser(1, [
        ['id' => '1', 'name' => 'Basic', 'features' => [], 'limits' => []],
    ]);

    expect($service->getDailyLimit($user))->toBe(0);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns 0 when plan id is not found in plans list', function () {
    $service = new AiAssistantQuotaService;
    $user = makeUser(9, []);

    expect($service->getDailyLimit($user))->toBe(0);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('formats cache key with current date', function () {
    $service = new AiAssistantQuotaService;

    expect($service->getCacheKey())->toBe('ai_requests:' . now()->format('Y-m-d'));
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('returns zero count when no requests have been made', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;

    expect($service->getCount())->toBe(0);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('increments count on each call', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;

    expect($service->increment())->toBe(1)
        ->and($service->increment())->toBe(2)
        ->and($service->getCount())->toBe(2);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('reports limit not reached when count is below limit', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;
    $user = makeUser(1); // limit = 30

    $service->increment(); // count = 1

    expect($service->isLimitReached($user))->toBeFalse();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('reports limit reached when count equals the daily limit', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;
    $user = makeUser(1); // limit = 30

    Cache::put($service->getCacheKey(), 30);

    expect($service->isLimitReached($user))->toBeTrue();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('reports limit reached when count exceeds the daily limit', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;
    $user = makeUser(1); // limit = 30

    Cache::put($service->getCacheKey(), 31);

    expect($service->isLimitReached($user))->toBeTrue();
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');

it('uses separate keys for different days', function () {
    Cache::flush();
    $service = new AiAssistantQuotaService;

    Cache::put('ai_requests:2024-01-01', 99);
    Cache::put('ai_requests:2024-01-02', 5);

    // Only the current day's key is used
    expect($service->getCount())->toBe(0);
})->skip(! $pluginInstalled, 'AiAssistant plugin not installed');
