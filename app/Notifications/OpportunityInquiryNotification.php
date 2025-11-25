<?php

namespace App\Notifications;

use App\Models\Opportunity;
use App\Models\OpportunityInquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OpportunityInquiryNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected OpportunityInquiry $inquiry, protected Opportunity $opportunity)
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
        $title = $this->opportunity->title;
        $sender_name = $this->inquiry->name;
        $sender_email = $this->inquiry->email;
        $message = $this->inquiry->message;

        return (new MailMessage)
            ->greeting('New Message Received')
            ->line("You have been sent a new message about: $title")
            ->line("Sender: $sender_name ($sender_email)")
            ->line("Message:")
            ->line($message);
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
