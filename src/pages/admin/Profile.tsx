import { useState } from 'react';
import { User as UserIcon, Mail, Lock, Camera, Bell, Save } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { initials, avatarColor } from '@/utils/format';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function Profile(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  const showToast = useUIStore((s) => s.showToast);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [notifyInApp, setNotifyInApp] = useState(true);

  const handleSaveProfile = (): void => {
    showToast('تم حفظ البيانات', 'success');
  };

  const handleChangePassword = (): void => {
    if (!currentPwd || !newPwd || !confirmPwd) {
      showToast('املأ جميع الحقول', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      showToast('كلمة المرور الجديدة غير مطابقة', 'error');
      return;
    }
    if (newPwd.length < 6) {
      showToast('كلمة المرور 6 أحرف على الأقل', 'error');
      return;
    }
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    showToast('تم تحديث كلمة المرور', 'success');
  };

  const handleSaveNotifications = (): void => {
    showToast('تم حفظ تفضيلات الإشعارات', 'success');
  };

  if (!user) return <div />;

  return (
    <div className="p-4 lg:p-8 space-y-5 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">الملف الشخصي</h2>
        <p className="text-sm text-muted-foreground">إدارة بيانات حسابك وتفضيلاتك</p>
      </div>

      {/* Basic info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-primary" />
            البيانات الأساسية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className={`text-xl font-bold ${avatarColor(user.name)}`}>
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <button
                className="absolute -bottom-1 -end-1 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors"
                title="تغيير الصورة"
                onClick={() => showToast('تحميل الصورة (تجريبي)', 'info')}
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">مدير النظام</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>الاسم الكامل</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>البريد الإلكتروني</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pe-9"
                />
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label>رقم الهاتف</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+96891234567" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>
              <Save className="h-4 w-4 me-2" />
              حفظ التغييرات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            كلمة المرور
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>كلمة المرور الحالية</Label>
              <Input type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>كلمة المرور الجديدة</Label>
              <Input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>تأكيد كلمة المرور</Label>
              <Input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword}>تحديث كلمة المرور</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            تفضيلات الإشعارات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">إشعارات البريد الإلكتروني</p>
              <p className="text-xs text-muted-foreground">تلقّي إشعارات على بريدك</p>
            </div>
            <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">إشعارات المتصفح (Push)</p>
              <p className="text-xs text-muted-foreground">إشعارات فورية في المتصفح</p>
            </div>
            <Switch checked={notifyPush} onCheckedChange={setNotifyPush} />
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">إشعارات داخل التطبيق</p>
              <p className="text-xs text-muted-foreground">إشعارات في جرس اللوحة</p>
            </div>
            <Switch checked={notifyInApp} onCheckedChange={setNotifyInApp} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>حفظ التفضيلات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
