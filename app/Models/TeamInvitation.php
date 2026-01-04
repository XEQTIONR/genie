<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TeamInvitation extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'team_id',
        'inviter_id',
        'invitee_id',
        'to_email',
        'roles',
        'permissions'
    ];

    protected function casts(): array {
        return [
            'roles' => 'array',
            'permissions' => 'array'
        ];
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inviter_id');
    }

    public function invitee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invitee_id');
    }
}
