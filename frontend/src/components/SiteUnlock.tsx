import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SiteUnlockProps {
  onUnlock: (password: string) => Promise<void>;
  isUnlocking: boolean;
  error: string | null;
}

export function SiteUnlock({ onUnlock, isUnlocking, error }: SiteUnlockProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      return;
    }
    await onUnlock(password);
  };

  return (
    <div className="min-h-screen grids flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md border border-dashed border-gray-300 bg-white p-6 text-gray-800">
        <h1 className="text-xl font-semibold mb-3">{t('Site locked')}</h1>
        <p className="text-sm text-gray-500 mb-5">
          {t('Enter site password to continue')}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Password')}
          className="w-full border border-dashed border-gray-300 bg-white px-3 py-2 mb-4 outline-none focus:ring-2 focus:ring-gray-400"
        />

        {error && <p className="text-sm text-rose-400 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={isUnlocking || !password.trim()}
          className="w-full py-2.5 text-white bg-gray-800 font-medium hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed">
          {isUnlocking ? t('Unlocking...') : t('Unlock')}
        </button>
      </form>
    </div>
  );
}
