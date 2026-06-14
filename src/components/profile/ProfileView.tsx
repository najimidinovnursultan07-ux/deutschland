"use client";

import { useState } from "react";
import { Mail, Target, Calendar, Pencil, Zap } from "lucide-react";
import { AchievementGallery } from "@/components/gamification/AchievementGallery";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { getUiString } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useAppStore } from "@/store/appStore";
import { useTranslation } from "@/hooks/useTranslation";
import { useInterfaceLang } from "@/hooks/useInterfaceLang";
import type { TargetLanguage } from "@/types";

export function ProfileView() {
  const { t } = useTranslation();
  const interfaceLang = useInterfaceLang();
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const languagePair = useAppStore((s) => s.languagePair);
  const xp = useAppStore((s) => s.xp);
  const streak = useAppStore((s) => s.streak);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState<TargetLanguage>(
    user?.targetLanguage ?? "de"
  );

  if (!user) return null;

  const handleSave = async () => {
    if (password && !currentPassword) {
      setSaveError(t("profile.currentPasswordRequired"));
      return;
    }

    setSaveError("");
    setSaving(true);
    const ok = await updateProfile({
      name,
      avatarUrl,
      targetLanguage,
      ...(password ? { password, currentPassword } : {}),
    });
    setSaving(false);

    if (!ok) {
      setSaveError(`${t("profile.saveFailed")} / ${t("profile.wrongPassword")}`);
      return;
    }

    setPassword("");
    setCurrentPassword("");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(user.name);
    setAvatarUrl(user.avatarUrl);
    setPassword("");
    setCurrentPassword("");
    setSaveError("");
    setTargetLanguage(user.targetLanguage);
    setIsEditing(false);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {getUiString(interfaceLang, "profile")}
        </h1>
        {!isEditing && (
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil size={16} />
            {getUiString(interfaceLang, "editProfile")}
          </Button>
        )}
      </div>

      <GlassCard className="text-center">
        <img
          src={isEditing ? avatarUrl : user.avatarUrl}
          alt={user.name}
          className="mx-auto h-24 w-24 rounded-full border-4 border-white/20 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`;
          }}
        />
        {!isEditing ? (
          <div className="mt-4">
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <div className="mt-4 space-y-2 text-sm text-white/60">
              <p className="flex items-center justify-center gap-2">
                <Mail size={14} />
                {user.email}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Target size={14} />
                {getUiString(interfaceLang, "targetLanguage")}:{" "}
                {user.targetLanguage === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Calendar size={14} />
                {new Date(user.createdAt).toLocaleDateString(
                  interfaceLang === "ky" ? "ky-KG" : "ru-RU"
                )}
              </p>
              <p className="flex items-center justify-center gap-2">
                <Zap size={14} className="text-amber-400" />
                {xp} XP · {streak} {t("profile.dayStreakSuffix")}
              </p>
              <p className="text-xs text-white/40">{languagePair}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-left">
            <Input
              label={t("name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label={t("profile.avatarUrl")}
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              disabled={saving}
            />
            {password ? (
              <PasswordInput
                label={t("profile.currentPassword")}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                disabled={saving}
              />
            ) : null}
            <PasswordInput
              label={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("profile.newPasswordPlaceholder")}
              autoComplete="new-password"
              disabled={saving}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/80">
                {getUiString(interfaceLang, "targetLanguage")}
              </label>
              <div className="flex gap-2">
                {(["de", "en"] as TargetLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setTargetLanguage(lang)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition-all ${
                      targetLanguage === lang
                        ? "border-violet-400 bg-violet-500/30 text-white"
                        : "border-white/20 bg-white/5 text-white/60"
                    }`}
                  >
                    {lang === "de" ? "🇩🇪 Deutsch" : "🇬🇧 English"}
                  </button>
                ))}
              </div>
            </div>
            {saveError && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
                {saveError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button className="flex-1" onClick={handleSave} disabled={saving}>
                {saving ? t("loading") : t("save")}
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={handleCancel}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>
        )}
      </GlassCard>

      <AchievementGallery />
    </div>
  );
}
