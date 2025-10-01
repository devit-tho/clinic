import { useAuth } from '@/auth/hooks';
import { useLocales } from '@/locales';
import { useRouter } from '@/routes/hooks';
import paths from '@/routes/paths';
import { Avatar } from "@heroui/avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

const AccountPopover: React.FC = () => {
  const { t } = useLocales();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  function pushToSetting() {
    router.push(paths.settings);
  }

  return (
    <Dropdown aria-label="Options dropdown" placement="bottom-end">
      <DropdownTrigger aria-label="Account Actions">
        <Avatar
          as="button"
          className="transition-transform"
          name="Jason Hughes"
          src={user?.imageUrl ?? '/images/profile.jpg'}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2" textValue="Sign In">
          <p className="font-semibold">{t('signed_in_as')}</p>
          <p className="font-semibold">{user?.alias}</p>
        </DropdownItem>
        <DropdownItem key="settings" onClick={pushToSetting}>
          {t('settings')}
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
          {t('logout')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AccountPopover;
