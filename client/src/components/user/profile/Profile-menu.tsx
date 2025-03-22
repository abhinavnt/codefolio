import { MenuItem } from "./Menu-item"

interface ProfileMenuProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function ProfileMenu({ activeTab, setActiveTab }: ProfileMenuProps) {
  const menuItems = ["Dashboard", "Courses", "Teachers", "Message", "Wishlist", "Purchase History", "Settings"]

  return (
    <div className="border-b overflow-x-auto">
      <div className="max-w-4xl mx-auto flex whitespace-nowrap">
        {menuItems.map((tab) => (
          <MenuItem key={tab} label={tab} isActive={activeTab === tab} onClick={() => setActiveTab(tab)} />
        ))}
      </div>
    </div>
  )
}

