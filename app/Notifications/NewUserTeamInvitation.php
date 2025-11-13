<?php

namespace App\Notifications;

use App\Models\TeamInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Arr;

class NewUserTeamInvitation extends Notification
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
        return ['mail'];
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
            ->line("You have been invited to join $team->name by $inviter->name.")
            ->line("Roles: " . $roles_str)
            ->action("Join $team->name", url('/'));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
