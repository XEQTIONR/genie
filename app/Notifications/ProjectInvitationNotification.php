<?php

namespace App\Notifications;

use App\Models\ProjectInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Lang;

class ProjectInvitationNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected ProjectInvitation $invitation)
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
        $this->invitation->load(['inviter', 'project']);
        $roles_str = Arr::join($this->invitation->roles,  ', ');
        $project = $this->invitation->project;
        $inviter = $this->invitation->inviter;
        return (new MailMessage)
            ->subject(Lang::get("Invitation to join $project->title project."))
            ->line(Lang::get("You have been invited to join the $project->title project by $inviter->name."))
            ->line(Lang::get("Roles: " . $roles_str))
            ->action(Lang::get("Join $project->title"), url(route('projectInvitation.show', ['invitation' => $this->invitation])));
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $this->invitation->load(['inviter', 'project']);
        return [
            'inviter' => $this->invitation->inviter,
            'project' => $this->invitation->project,
            'roles' => $this->invitation->roles,
            'permissions' => $this->invitation->permissions,
            'to_email' => $this->invitation->to_email,
        ];
    }
}
