import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

function IconBase({
  children,
  ...props
}: Props & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (props: Props) => (
  <IconBase {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </IconBase>
);
export const UserIcon = (props: Props) => (
  <IconBase {...props}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" />
  </IconBase>
);
export const BagIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M6 8h12l1 12H5L6 8Z" />
    <path d="M9 9V6a3 3 0 0 1 6 0v3" />
  </IconBase>
);
export const MenuIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </IconBase>
);
export const CloseIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </IconBase>
);
export const ArrowIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M5 12h14M14 7l5 5-5 5" />
  </IconBase>
);
export const LeafIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M19 4C11 4 5 8.5 5 15c4.5 0 10-2.5 14-11Z" />
    <path d="M5 20c2-5 5.5-8.5 10.5-11.5" />
  </IconBase>
);
export const DropIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M12 3s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z" />
  </IconBase>
);
export const SparklesIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3ZM18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z" />
  </IconBase>
);
export const ChevronDownIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m7 10 5 5 5-5" />
  </IconBase>
);
export const ChevronRightIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m9 6 6 6-6 6" />
  </IconBase>
);
export const CheckIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m5 12 4 4L19 6" />
  </IconBase>
);
export const MailIcon = (props: Props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </IconBase>
);
export const PhoneIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M5 4h3l2 5-2 1c1.3 2.7 3.3 4.7 6 6l1-2 5 2v3c0 1.1-.9 2-2 2C10.3 21 3 13.7 3 6c0-1.1.9-2 2-2Z" />
  </IconBase>
);
export const MapPinIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2" />
  </IconBase>
);
export const ShieldIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M12 3 19 6v5c0 4.5-2.4 7.7-7 10-4.6-2.3-7-5.5-7-10V6l7-3Z" />
    <path d="m9 12 2 2 4-5" />
  </IconBase>
);
export const BoxIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m4 7 8-4 8 4-8 4-8-4Z" />
    <path d="M4 7v10l8 4 8-4V7M12 11v10" />
  </IconBase>
);
export const ChartIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M4 20h16M7 17v-5M12 17V7M17 17V4" />
  </IconBase>
);
export const SettingsIcon = (props: Props) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L14.5 3h-5L9 6a7 7 0 0 0-1.7 1L5 6 3 9.5 5 11a7 7 0 0 0 0 2l-2 1.5L5 18l2.3-1a7 7 0 0 0 1.7 1l.5 3h5l.5-3a7 7 0 0 0 1.7-1l2.3 1 2-3.5-2-1.5a7 7 0 0 0 .1-1Z" />
  </IconBase>
);
export const HomeIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m3 11 9-8 9 8" />
    <path d="M5 10v10h14V10M9 20v-6h6v6" />
  </IconBase>
);
export const PackageIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z" />
    <path d="m4 7 8 4 8-4M12 11v10" />
  </IconBase>
);
export const UsersIcon = (props: Props) => (
  <IconBase {...props}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 19c.7-3.7 2.6-5.5 5.5-5.5s4.8 1.8 5.5 5.5" />
    <path d="M15 6.5a2.7 2.7 0 0 1 0 5.2M16.5 14c2.2.5 3.5 2.2 4 5" />
  </IconBase>
);
export const FileTextIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M6 3h8l4 4v14H6V3Z" />
    <path d="M14 3v5h5M9 12h6M9 16h6" />
  </IconBase>
);
export const LockIcon = (props: Props) => (
  <IconBase {...props}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </IconBase>
);
export const LogOutIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />
  </IconBase>
);
export const CreditCardIcon = (props: Props) => (
  <IconBase {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18M7 15h3" />
  </IconBase>
);
export const TruckIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="18" cy="18" r="2" />
  </IconBase>
);
export const HeartIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M20.8 5.8a5 5 0 0 0-7.1 0L12 7.5l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.1a5 5 0 0 0 0-7.1Z" />
  </IconBase>
);
export const EyeIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </IconBase>
);
export const RefreshIcon = (props: Props) => (
  <IconBase {...props}>
    <path d="M20 6v5h-5M4 18v-5h5" />
    <path d="M6.1 8.5A7 7 0 0 1 18 7l2 4M18 15.5A7 7 0 0 1 6 17l-2-4" />
  </IconBase>
);
export const MoreIcon = (props: Props) => (
  <IconBase {...props}>
    <circle cx="5" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="19" cy="12" r="1" fill="currentColor" stroke="none" />
  </IconBase>
);
