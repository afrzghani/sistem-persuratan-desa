import assetOrg from "../../assets/assetorg.png";

function WelcomeCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex min-h-48 items-center justify-between px-8 py-6">
        <div>
          <h2 className="text-3xl font-bold text-emerald-600">
            Selamat datang di Sapa Desa!
          </h2>

          <p className="mt-3 max-w-xl text-slate-500">
            Kelola administrasi dan pelayanan desa dengan <br />
            lebih mudah dalam satu platform.
          </p>
        </div>

        <div className="hidden md:flex w-1/3 items-end justify-end">
          <img
            src={assetOrg}
            alt="Ilustrasi Dashboard"
            className="w-44 lg:w-52 xl:w-60 h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomeCard;