import config from "@/config";
import { useLocales } from "@/locales";

export type ItemOption = {
  key: string | number;
  label: string;
};

type OptionType = "gender" | "status" | "role" | "treatment-coverage";

export function useOptions(option: OptionType): ItemOption[] {
  const { t } = useLocales();

  switch (option) {
    case "gender":
      return Object.values(config.GENDER).map<ItemOption>((key) => ({
        key,
        label: t(`gender.${key}`),
      }));
    case "status":
      return Object.values(config.STATUS).map<ItemOption>((key) => ({
        key,
        label: t(`status_options.${key}`),
      }));
    case "role":
      return Object.values(config.ROLE)
        .filter((key) => key !== config.ROLE.ADMIN)
        .map<ItemOption>((key) => ({
          key,
          label: t(`role.${key}`),
        }));
    case "treatment-coverage":
      return Object.values(config.TREATMENT_COVERAGE).map<ItemOption>(
        (key) => ({
          key,
          label: t(`treatment_coverage.${key}`),
        }),
      );
    default:
      return [];
  }
}
