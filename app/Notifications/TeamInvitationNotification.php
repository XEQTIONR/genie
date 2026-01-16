<?php

namespace App\Notifications;

use App\Models\TeamInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Arr;

class TeamInvitationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected TeamInvitation $invitation)
    {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $this->invitation->load(['inviter', 'team']);
        $roles_str = Arr::join($this->invitation->roles,  ', ');
        $team = $this->invitation->team;
        $inviter = $this->invitation->inviter;
        return (new MailMessage)
            ->subject(Lang::get("Invitation to join $team->name team."))
            ->line(Lang::get("You have been invited to join $team->name by $inviter->name."))
            ->line(Lang::get("Roles: " . $roles_str))
            ->action(Lang::get("Join $team->name"), url(route('teamInvitation.show', ['invitation' => $this->invitation])));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->invitation->load(['inviter', 'team']);
        return [
            'inviter' => $this->invitation->inviter,
            'team' => $this->invitation->team,
            'roles' => $this->invitation->roles,
            'permissions' => $this->invitation->permissions,
            'to_email' => $this->invitation->to_email,
        ];
    }
}
