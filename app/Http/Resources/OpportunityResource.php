<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OpportunityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $types = explode('\\', $this->owner_type);

        return [
            'id' => $this->id,
            'compensation_type' => $this->compensation_type,
            'description' => $this->description,
            'employment_type' => $this->employment_type,
            'location_type' => $this->location_type,
            'locations' => $this->locations,
            'primary_role' => $this->primary_role,
            'tags' => $this->tags,
            'title' => $this->title,
            'work_location' => $this->work_location,
            'owner' => $this->owner,
            'owner_type' => $types[count($types) - 1],
            'creator' => $this->whenLoaded('creator'),
            'created_at' => $this->created_at,

        ];
    }
}
