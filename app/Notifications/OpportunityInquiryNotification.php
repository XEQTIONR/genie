<?php

namespace App\Notifications;

use App\Models\Opportunity;
use App\Models\OpportunityInquiry;
use Illuminate\Bus\Queueable;
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
        $message = str_replace("\r\n", "\n", $message);

        $mail = (new MailMessage)
            ->greeting('New Message Received')
            ->line("You have been sent a new message about: $title")
            ->line("Sender: $sender_name ($sender_email)")
            ->line("Message:");
        
        $lines = explode("\n", $message);

        $lengths = [];

        foreach ($lines as $line) {
            $lengths[] = strlen($line);
            if (strlen($line) > 0) {
                $mail = $mail->line($line);
            }
        }

        $mail = $mail->line('You can contact this person by emailing them directly via the email listed.');

        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        
        return [
            'opportunity' => $this->opportunity,
            'inquiry' => $this->inquiry,
        ];
    }
}
