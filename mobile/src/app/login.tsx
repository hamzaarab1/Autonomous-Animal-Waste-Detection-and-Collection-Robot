import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { YardIllustration } from '@/components/yard-illustration';
import { YardSentryMark, YardSentryWordmark } from '@/components/yardsentry-logo';
import { Button } from '@/components/button';
import { Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { useAuth } from '@/lib/auth-context';
import { signInWithGoogle } from '@/lib/google-sign-in';
import { notify } from '@/lib/notify';

type Mode = 'login' | 'signup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export default function LoginScreen() {
  const { user } = useAuth();
  const { isDesktop } = useLayout();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'signup' ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  // Follow the ?mode= param when the screen is reached via a link to a specific mode.
  useEffect(() => {
    if (params.mode === 'signup' || params.mode === 'login') setMode(params.mode);
  }, [params.mode]);

  const isSignup = mode === 'signup';

  function switchMode() {
    setMode(isSignup ? 'login' : 'signup');
    setError(null);
  }

  function validate(): string | null {
    if (isSignup && !name.trim()) return 'Enter your name.';
    if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.';
    if (isSignup && password.length < MIN_PASSWORD) {
      return `Password must be at least ${MIN_PASSWORD} characters.`;
    }
    if (!password) return 'Enter your password.';
    return null;
  }

  async function handleSubmit() {
    const problem = validate();
    setError(problem);
    if (problem) return;

    setSubmitting(true);
    // TODO: replace with the real auth call once the robot/account API is defined.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSubmitting(false);
    notify(
      isSignup ? 'Account created' : 'Signed in',
      'Authentication is not connected yet. This screen is a UI preview.',
    );
  }

  async function handleGoogle() {
    setError(null);
    setGoogleSubmitting(true);
    try {
      // On success the auth state changes and the <Redirect> below sends the user to the dashboard.
      // A null result means they backed out of the Google picker.
      await signInWithGoogle();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleSubmitting(false);
    }
  }

  if (user) return <Redirect href="/dashboard" />;

  return (
    <SafeAreaView style={[styles.safe, isDesktop && styles.row]} edges={['top', 'bottom']}>
      {isDesktop && <BrandPanel />}
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, isDesktop && styles.scrollCentered]}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.container, isDesktop && styles.containerDesktop]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              hitSlop={12}
              style={styles.back}
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
              <Ionicons name="chevron-back" size={24} color={Colors.forest} />
            </Pressable>

            <View style={styles.header}>
              <View style={styles.markBadge}>
                <YardSentryMark width={28} />
              </View>
              <Text style={styles.title}>{isSignup ? 'Create your account' : 'Welcome back'}</Text>
              <Text style={styles.subtitle}>
                {isSignup
                  ? 'Set up an account, then pair your first YardSentry robot.'
                  : 'Log in to check on your robots and start a clean.'}
              </Text>
            </View>

            <View style={styles.form}>
              {isSignup && (
                <Field
                  label="Name"
                  value={name}
                  onChangeText={setName}
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                />
              )}
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
              />
              <Field
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                textContentType={isSignup ? 'newPassword' : 'password'}
                returnKeyType="go"
                onSubmitEditing={handleSubmit}
                trailing={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    hitSlop={10}
                    onPress={() => setShowPassword((v) => !v)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Colors.textMuted}
                    />
                  </Pressable>
                }
              />

              {!isSignup && (
                <Pressable
                  style={styles.forgot}
                  hitSlop={8}
                  onPress={() => notify('Reset password', 'Password reset is coming soon.')}>
                  <Text style={styles.link}>Forgot password?</Text>
                </Pressable>
              )}

              {error && (
                <View style={styles.error} accessibilityLiveRegion="polite">
                  <Ionicons name="alert-circle" size={18} color={Colors.danger} />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.submit}>
                <Button
                  title={isSignup ? 'Create account' : 'Log in'}
                  loading={submitting}
                  disabled={googleSubmitting}
                  onPress={handleSubmit}
                />
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Continue with Google"
                variant="secondary"
                icon={<Ionicons name="logo-google" size={20} color={Colors.forest} />}
                loading={googleSubmitting}
                disabled={submitting}
                onPress={handleGoogle}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>
                {isSignup ? 'Already have an account?' : 'New to YardSentry?'}
              </Text>
              <Pressable hitSlop={8} onPress={switchMode}>
                <Text style={styles.link}>{isSignup ? 'Log in' : 'Create an account'}</Text>
              </Pressable>
            </View>

            <View style={styles.note}>
              <Ionicons name="qr-code-outline" size={20} color={Colors.primary} />
              <Text style={styles.noteText}>
                After you log in, you’ll pair a robot by scanning the QR code in its box.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/** Left half of the desktop login: brand, pitch, and the yard illustration. */
function BrandPanel() {
  return (
    <View style={styles.brandPanel}>
      <YardSentryWordmark width={200} tone="dark" />
      <View style={styles.brandBody}>
        <Text style={styles.brandHeadline}>A cleaner yard,{'\n'}without lifting a finger.</Text>
        <Text style={styles.brandLead}>
          Check on your robots, start a clean, set a schedule, and review what they found, all in one place.
        </Text>
      </View>
      <YardIllustration width={420} />
    </View>
  );
}

function Field({ label, trailing, ...input }: TextInputProps & { label: string; trailing?: ReactNode }) {
  const [focused, setFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputFocused]}>
        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...input}
        />
        {trailing}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  scrollCentered: {
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  containerDesktop: {
    maxWidth: 440,
  },
  brandPanel: {
    flex: 1,
    maxWidth: 720,
    backgroundColor: Colors.forest,
    padding: Spacing.xxl,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandBody: {
    maxWidth: 480,
  },
  brandHeadline: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: -0.6,
  },
  brandLead: {
    marginTop: Spacing.md,
    fontSize: 18,
    lineHeight: 27,
    color: Colors.mintStrong,
  },
  back: {
    marginTop: Spacing.sm,
    width: 40,
    height: 40,
    marginLeft: -Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: Spacing.lg,
  },
  markBadge: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.lg,
    fontSize: 30,
    fontWeight: '800',
    color: Colors.forest,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: Spacing.sm,
    fontSize: 16,
    lineHeight: 23,
    color: Colors.textMuted,
  },
  form: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  inputFocused: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: Spacing.sm + 4,
  },
  forgot: {
    alignSelf: 'flex-end',
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  error: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 4,
    borderRadius: Radius.sm,
    backgroundColor: '#FCEDEC',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: Colors.danger,
  },
  submit: {
    marginTop: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  switchRow: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  switchText: {
    fontSize: 15,
    color: Colors.textMuted,
  },
  note: {
    marginTop: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.mint,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.forest,
  },
});
