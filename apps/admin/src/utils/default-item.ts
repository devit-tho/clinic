import config from "@/config";
import _capitalize from "lodash/capitalize";
import _lowerCase from "lodash/lowerCase";

export type Item = {
  key: string | number;
  label: string;
};

export const genders = Object.values(config.GENDER).map<Item>((key) => ({
  key,
  label: _capitalize(key),
}));

export const statuses = Object.values(config.STATUS).map<Item>((key) => ({
  key,
  label: _lowerCase(_capitalize(key)),
}));

export const roles = Object.values(config.ROLE)
  .filter((key) => key !== config.ROLE.ADMIN)
  .map<Item>((key) => ({
    key,
    label: _capitalize(key),
  }));
