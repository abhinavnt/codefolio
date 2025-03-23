
interface MenuItemProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export function MenuItem({ label, isActive, onClick }: MenuItemProps) {
  return (
    <button
      className={`px-4 sm:px-6 py-4 text-sm font-medium ${isActive ? "border-b-2 border-emerald-500" : "text-gray-500"}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

