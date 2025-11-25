<?php

namespace App\Http\Controllers;

use App\Models\Opportunity;
use App\Models\OpportunityInquiry;
use App\Notifications\OpportunityInquiryNotification;
use Illuminate\Http\Request;

class OpportunityInquiryController extends Controller
{
    public function store(Request $request, Opportunity $opportunity)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        $inqury = new OpportunityInquiry([
            ...$validated,
            'status' => 'created'
        ]);

        $opportunity->inquiries()->save($inqury);
        $inqury->save();
        $opportunity = $inqury->opportunity;
        $receiver = $opportunity->creator;
        $receiver->notify(new OpportunityInquiryNotification($inqury, $opportunity));

        return to_route('opportunities.show', ['opportunity' => $opportunity])
            ->with('notification', [
                'type' => 'info',
                'message' => "Message sent.",
                'button' => null
            ]);

    }
}
