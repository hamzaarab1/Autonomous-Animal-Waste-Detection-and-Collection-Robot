import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ComponentProps, ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { YardSentryMark, YardSentryWordmark } from '@/components/yardsentry-logo';
import { Button } from '@/components/button';
import { YardIllustration } from '@/components/yard-illustration';
import { Colors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const STEPS: { title: string; body: string }[] = [
  {
    title: 'Pair your robot',
    body: 'Scan the QR code that ships with your YardSentry. Only paired devices can control it.',
  },
  {
    title: 'Teach the boundary',
    body: 'Drive the robot once around the area you want cleaned. It records the path and turns it into its operating area.',
  },
  {
    title: 'Start or schedule',
    body: 'Start a clean now, or set a schedule that runs on its own.',
  },
  {
    title: 'YardSentry does the rest',
    body: 'It searches the area, detects waste, drives to it, picks it up, and stores it onboard.',
  },
];

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'wifi',
    title: 'Works without internet',
    body: 'The robot runs its own Wi-Fi network. Your phone connects to it directly, even in a cottage or rural yard.',
  },
  {
    icon: 'map-outline',
    title: 'You decide where it goes',
    body: "An open lawn has no edge a robot can see, so you teach it the boundary. It won't leave that area.",
  },
  {
    icon: 'scan-outline',
    title: 'Knows waste from rocks',
    body: 'Computer vision tells animal waste apart from rocks, leaves, pinecones, toys, and shadows.',
  },
  {
    icon: 'help-circle-outline',
    title: 'Asks when unsure',
    body: 'When it isn’t confident about an object, it can send you a photo to confirm before picking it up.',
  },
  {
    icon: 'albums-outline',
    title: 'More than one robot',
    body: 'Name each robot, like Backyard Cleaner or Cottage Cleaner. Each gets its own boundary and schedule.',
  },
  {
    icon: 'lock-closed-outline',
    title: 'Your data stays local',
    body: 'Boundaries, schedules, and history are stored on the robot itself. No cloud account required.',
  },
];

const CONTROLS: { icon: IconName; label: string }[] = [
  { icon: 'game-controller-outline', label: 'Manual drive' },
  { icon: 'battery-half-outline', label: 'Battery & status' },
  { icon: 'calendar-outline', label: 'Schedules' },
  { icon: 'home-outline', label: 'Return home' },
  { icon: 'stop-circle-outline', label: 'Emergency stop' },
  { icon: 'time-outline', label: 'Detection history' },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <YardSentryMark width={24} />
            <Button title="Log in" variant="ghost" onPress={() => router.push('/login')} />
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <YardSentryWordmark width={250} />
            <Text style={styles.expansion}>The autonomous yard-cleaning robot</Text>
            <Text style={styles.headline}>A cleaner yard,{'\n'}without lifting a finger.</Text>
            <Text style={styles.lead}>
              YardSentry is an outdoor robot that finds and picks up animal waste in your backyard or at
              the cottage, then stores it onboard so you don’t have to.
            </Text>
            <View style={styles.heroActions}>
              <Button title="Get started" onPress={() => router.push('/login?mode=signup')} />
              <Button title="I already have an account" variant="secondary" onPress={() => router.push('/login')} />
            </View>
          </View>

          <View style={styles.illustration}>
            <YardIllustration width={Math.min(MaxContentWidth - Spacing.lg * 2, 340)} />
          </View>

          {/* How it works */}
          <Section eyebrow="How it works" title="Set it up once. Then let it work.">
            {STEPS.map((step, i) => (
              <View key={step.title} style={styles.step}>
                <View style={styles.stepIndex}>
                  <Text style={styles.stepIndexText}>{i + 1}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={styles.cardTitle}>{step.title}</Text>
                  <Text style={styles.body}>{step.body}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* Features */}
          <Section eyebrow="Why YardSentry" title="Built for real yards.">
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={f.icon} size={22} color={Colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.cardTitle}>{f.title}</Text>
                  <Text style={styles.body}>{f.body}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* Controls */}
          <Section eyebrow="In the app" title="Everything in one place.">
            <View style={styles.chips}>
              {CONTROLS.map((c) => (
                <View key={c.label} style={styles.chip}>
                  <Ionicons name={c.icon} size={18} color={Colors.forest} />
                  <Text style={styles.chipText}>{c.label}</Text>
                </View>
              ))}
            </View>
          </Section>

          {/* Closing CTA */}
          <View style={styles.cta}>
            <YardSentryMark width={34} tone="dark" />
            <Text style={styles.ctaTitle}>Ready to meet your robot?</Text>
            <Text style={styles.ctaBody}>
              Create an account, then pair your YardSentry using the QR code in the box.
            </Text>
            <View style={styles.ctaButton}>
              <Button title="Create account" onPress={() => router.push('/login?mode=signup')} />
            </View>
          </View>

          <Text style={styles.footer}>YardSentry prototype · Capstone Project OSS 4001</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingBottom: Spacing.xxl,
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.lg,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  hero: {
    paddingTop: Spacing.xl,
  },
  expansion: {
    marginTop: Spacing.md,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  headline: {
    marginTop: Spacing.lg,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    color: Colors.forest,
    letterSpacing: -0.5,
  },
  lead: {
    marginTop: Spacing.md,
    fontSize: 17,
    lineHeight: 25,
    color: Colors.textMuted,
  },
  heroActions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm + 4,
  },
  illustration: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.xxl,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  sectionTitle: {
    marginTop: Spacing.xs + 2,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: Colors.forest,
    letterSpacing: -0.3,
  },
  sectionBody: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stepIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIndexText: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  body: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textMuted,
  },
  featureCard: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.sm + 4,
    backgroundColor: Colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md - 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.mint,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.forest,
  },
  cta: {
    marginTop: Spacing.xxl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    backgroundColor: Colors.forest,
    alignItems: 'flex-start',
  },
  ctaTitle: {
    marginTop: Spacing.md,
    fontSize: 24,
    fontWeight: '800',
    color: Colors.white,
  },
  ctaBody: {
    marginTop: Spacing.sm,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.mintStrong,
  },
  ctaButton: {
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
  },
  footer: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
