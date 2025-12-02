<?php

namespace App\Http\Controllers;

use App\Models\Upload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        // post_max_size=128M
        // upload_max_filesize=128M

        try {
            $fileName = Storage::disk('public')->put('', $request->file);
            $mime = $request->mime;
            $url = Storage::url($fileName);
            $upload = new Upload([
                'name' => $fileName,
                'url' => $url,
                'mime' => $mime,
            ]);
            $upload->save();

            return [
                'status' => 'success',
                'upload' => $url
            ];
        } catch(\Exception $e) {
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}
