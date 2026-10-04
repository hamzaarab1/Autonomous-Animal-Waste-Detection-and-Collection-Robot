import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, type ReactNode } from 'react';
import {
  Alert,
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

import { YardSentryMark } from '@/components/yardsentry-logo';
import { Button } from '@/components/button';
import { Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

type Mode = 'login' | 'signup';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export default function LoginScreen() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<Mode>(params.mode === 'signup' ? 'signup' : 'login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
    Alert.alert(
      isSignup ? 'Account created' : 'Signed in',
      'Authentication is not connected yet. This screen is a UI preview.',
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
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
                  onPress={() => Alert.alert('Reset password', 'Password reset is coming soon.')}>
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
                  onPress={handleSubmit}
                />
              </View>
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
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
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
