import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"


function Avatar({
  className,
  variant = 'rounded',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { variant?: 'rounded' | 'square'}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden",
        variant == 'rounded' ? 'rounded-full' : 'rounded',
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  variant = 'rounded',
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & { variant?: 'rounded' | 'square'}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center",
        variant == 'rounded' ? 'rounded-full' : 'rounded-lg',
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
