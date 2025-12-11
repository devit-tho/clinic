import Logo from "../logo";

const SplashScreen: React.FC = () => (
  <div className="fixed inset-0 size-full grid min-h-screen place-items-center bg-background">
    <Logo disabledLink className="size-44" />
  </div>
);

export default SplashScreen;
