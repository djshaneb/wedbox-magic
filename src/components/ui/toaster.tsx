import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            duration={1500}
            className="backdrop-blur-sm border-wedding-pink/20 shadow-lg bg-black/40"
          >
            <div className="grid gap-1">
              {title && <ToastTitle className="text-2xl font-extralight tracking-wider text-wedding-pink drop-shadow-md relative z-10">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-base font-medium text-white/90 drop-shadow-lg tracking-wide relative z-10">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  )
}