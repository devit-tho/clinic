import FormProvider, {
  RHFDatePicker,
  RHFSelect,
  RHFSwitch,
  RHFTextField,
} from "@/components/hook-form";
import { ShowHideBtn } from "@/components/show-hide-btn";
import { useLocales } from "@/locales";
import { FormProps } from "@/types";
import { genders, Item, roles } from "@/utils/default-item";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { UserWithoutPassword } from "@repo/entities";
import {
  CreateUserSchema,
  CreateUserType,
  UpdateUserSchema,
  UpdateUserType,
} from "@repo/schemas";
import clsx from "clsx";
import isEmpty from "lodash/isEmpty";
import _isUndefined from "lodash/isUndefined";
import lowerCase from "lodash/lowerCase";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

// ----------------------------------------------------------------------

interface Photo {
  file: File | null;
  image: string | null;
}

interface UserFormProps
  extends FormProps<UserWithoutPassword, CreateUserType | UpdateUserType> {
  settings?: boolean;
}

// ----------------------------------------------------------------------

function UserForm({
  onSubmit,
  initialValues,
  settings = false,
}: UserFormProps) {
  const [photo, setPhoto] = useState<Photo>({
    file: null,
    image: null,
  });

  const editMode = !isEmpty(initialValues);

  const defaultValues: CreateUserType | UpdateUserType = {
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    phoneNumber: initialValues?.phoneNumber ?? "",
    dateOfBirth: initialValues?.dateOfBirth ?? new Date(),
    gender: initialValues?.gender ?? "Male",
    role: initialValues?.role ?? "STAFF",
    imageUrl: initialValues?.imageUrl ?? "/images/profile.jpg",
    placeOfBirth: initialValues?.placeOfBirth ?? {
      street: "",
      city: "",
      state: "",
      postalCode: "",
    },
    email: "",
    toggle: false,
    password: "",
  };

  const methods = useForm<CreateUserType | UpdateUserType>({
    defaultValues,
    mode: "onSubmit",
    resolver: zodResolver(editMode ? UpdateUserSchema : CreateUserSchema),
  });

  const { watch, handleSubmit } = methods;

  const value = watch();

  const uploadRef = useRef<HTMLInputElement>(null);
  const { t } = useLocales();

  const showPassword = useBoolean();

  const genderOptions = genders.map<Item>((gender) => ({
    key: gender.key,
    label: t(lowerCase(gender.label)),
  }));

  const roleOptions = roles.map<Item>((role) => ({
    key: role.key,
    label: t(lowerCase(role.label)),
  }));

  useEffect(() => {
    if (settings) {
      setPhoto({ file: null, image: value.imageUrl ?? "/images/profile.jpg" });
    }
  }, [settings]);

  function clickUpload() {
    if (!uploadRef.current) return;
    uploadRef.current.click();
  }

  function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto({ file, image: URL.createObjectURL(file) });
  }

  const submit = handleSubmit(async (v: CreateUserType | UpdateUserType) => {
    try {
      await onSubmit(v);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={submit}>
      <div className="flex flex-col gap-y-10">
        {settings && (
          <div className="relative self-center">
            <div className="size-44 overflow-hidden rounded-full bg-default-200">
              <img
                src={photo.image as string}
                alt="avatar"
                className="size-full"
              />
            </div>
            <Button
              isIconOnly
              radius="full"
              className="absolute bottom-0 right-0"
              onPress={clickUpload}
            >
              <Icon icon="lucide:camera" className="size-5" />
            </Button>
            <Input
              ref={uploadRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          <RHFTextField
            aria-label="first-name"
            name="firstName"
            label={t("settings_form.first_name")}
            placeholder={t("settings_form.first_name_placeholder")}
            autoComplete="off"
            isRequired
            isClearable
          />

          <RHFTextField
            aria-label="last-name"
            name="lastName"
            label={t("settings_form.last_name")}
            placeholder={t("settings_form.last_name_placeholder")}
            autoComplete="off"
            isRequired
            isClearable
          />

          <RHFTextField
            aria-label="email"
            name="email"
            label={t("settings_form.email")}
            placeholder={t("settings_form.email_placeholder")}
            autoComplete="off"
            isRequired
            isClearable
          />

          <RHFTextField
            aria-label="phone-number"
            name="phoneNumber"
            label={t("phone_number")}
            placeholder={t("settings_form.phone_number_placeholder")}
            autoComplete="off"
            isRequired
            isClearable
          />

          <RHFDatePicker
            aria-label="date-of-birth"
            name="dateOfBirth"
            label={t("settings_form.date_of_birth")}
            showMonthAndYearPickers
            granularity="day"
            hideTimeZone
            isRequired
          />

          <div
            className={clsx(
              "grid gap-x-2.5",
              !settings ? "grid-cols-2" : "grid-cols-1"
            )}
          >
            <RHFSelect
              aria-label="gender"
              name="gender"
              label={t("gender")}
              placeholder={t("settings_form.gender_placeholder")}
              items={genderOptions}
              selectionMode="single"
              isRequired
            />

            {!settings && (
              <RHFSelect
                name="role"
                label={t("role")}
                placeholder="Select your role"
                items={roleOptions}
                isRequired
              />
            )}
          </div>

          {!_isUndefined((value as CreateUserType).toggle) &&
            !(value as CreateUserType).toggle && (
              <div className="grid grid-cols-2 gap-x-2.5">
                <RHFTextField
                  aria-label="password"
                  name="password"
                  type={showPassword.value ? "text" : "password"}
                  label={t("password")}
                  placeholder={t("settings_form.password_placeholder")}
                  endContent={
                    <ShowHideBtn
                      onClick={showPassword.toggle}
                      show={showPassword.value}
                    />
                  }
                  isClearable
                />
              </div>
            )}
        </div>

        <div className="flex justify-between items-center gap-x-2.5">
          {!editMode && !settings && (
            <RHFSwitch name="toggle">
              {t("settings_form.generate_password")}
            </RHFSwitch>
          )}

          <Button type="submit" color="primary">
            {t("add")}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}

export default UserForm;
