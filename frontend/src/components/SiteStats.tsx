import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getSiteStats, type SiteStats as SiteStatsType } from "../services/api";
import MailIcon from "./icons/MailIcon";
import UserCircleIcon from "./icons/UserCircleIcon";
import ApiIcon from "./icons/ApiIcon";
import ServerIcon from "./icons/ServerIcon";

// vmail.dev 域名的历史数据基础值
const VMAIL_DEV_BASE_STATS = {
  totalAddressesCreated: 56023,
  totalEmailsReceived: 1342678,
  totalApiKeysCreated: 1840,
  totalApiCalls: 15734,
};

// 检查是否是 vmail.dev 域名
function isVmailDev(): boolean {
  return (
    typeof window !== "undefined" && window.location.hostname === "vmail.dev"
  );
}

// 格式化数字，添加千分位分隔符
function formatNumber(num: number): string {
  return num.toLocaleString();
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-4 border border-dashed border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm">
      <div className={`p-2 rounded-full mb-2 ${color}`}>{icon}</div>
      <span className="text-2xl font-bold text-gray-900 mb-1">
        {formatNumber(value)}
      </span>
      <span className="text-xs text-gray-600 font-medium text-center">{label}</span>
    </div>
  );
}

function mergeWithBase(stats: SiteStatsType): SiteStatsType {
  if (!isVmailDev()) {
    return stats;
  }

  return {
    totals: {
      totalAddressesCreated:
        stats.totals.totalAddressesCreated +
        VMAIL_DEV_BASE_STATS.totalAddressesCreated,
      totalEmailsReceived:
        stats.totals.totalEmailsReceived +
        VMAIL_DEV_BASE_STATS.totalEmailsReceived,
      totalApiKeysCreated:
        stats.totals.totalApiKeysCreated +
        VMAIL_DEV_BASE_STATS.totalApiKeysCreated,
      totalApiCalls:
        stats.totals.totalApiCalls + VMAIL_DEV_BASE_STATS.totalApiCalls,
    },
  };
}

export function SiteStats() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<SiteStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSiteStats();
        setStats(mergeWithBase(data));
      } catch (error) {
        console.error("Failed to fetch site stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center py-4 px-2">
        <div className="animate-pulse grid grid-cols-2 gap-3 w-full max-w-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 border border-dashed border-gray-300"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="w-full flex flex-col items-center py-4 px-2">
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        <StatCard
          icon={<UserCircleIcon className="w-5 h-5 text-gray-600" />}
          label={t("Addresses Created")}
          value={stats.totals.totalAddressesCreated}
          color="bg-gray-100"
        />
        <StatCard
          icon={<MailIcon className="w-5 h-5 text-gray-600" />}
          label={t("Emails Received")}
          value={stats.totals.totalEmailsReceived}
          color="bg-gray-100"
        />
        <StatCard
          icon={<ApiIcon className="w-5 h-5 text-gray-600" />}
          label={t("API Keys Created")}
          value={stats.totals.totalApiKeysCreated}
          color="bg-gray-100"
        />
        <StatCard
          icon={<ServerIcon className="w-5 h-5 text-gray-600" />}
          label={t("API Calls")}
          value={stats.totals.totalApiCalls}
          color="bg-gray-100"
        />
      </div>
      <p className="text-gray-600 text-xs mt-4 text-center font-medium">
        {t("Please create a temporary email address first")}
      </p>
    </div>
  );
}
