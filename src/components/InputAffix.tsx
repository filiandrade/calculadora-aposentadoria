import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Props = React.ComponentProps<typeof Input> & {
  prefix?: string
  suffix?: string
}

export function InputAffix({ prefix, suffix, className, ...rest }: Props) {
  return (
    <div className="relative">
      {!!prefix && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {prefix}&nbsp;
        </span>
      )}
      <Input
        className={cn(prefix ? "pl-12" : "", suffix ? "pr-10" : "", className)}
        {...rest}
      />
      {!!suffix && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  )
}
