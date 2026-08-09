import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  BarChart3,
  LineChart,
  FlaskConical,
  Activity,
  Workflow,
  Binary,
  Code2,
  Sparkles,
  Brain,
  SearchCode,
  Cpu,
  Bot,
  PieChart,
  ChevronRight,
  Lock,
  ArrowLeft,
  Calendar,
  UserCheck,
  Monitor,
  Users,
  AlertTriangle,
  HelpCircle,
  GraduationCap,
  User,
  Shuffle,
  ChevronDown,
  Info,
  ShieldCheck,
  X,
  Check,
  Target,
  TrendingUp,
} from 'lucide-react';

// ==========================================
// TYPES DEFINITIONS
// ==========================================

export type UserName = '박지성' | '이영표' | '류현진' | '손흥민' | '박찬호';

export type BadgeType = '노랑' | '녹색' | '검정' | '실버크라운' | '골드크라운';

// 0: 없음, 1: 노랑, 2: 녹색, 3: 검정, 4: 실버크라운, 5: 골드크라운
export type BadgeLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ModuleId =
  | '기술통계'
  | '추론통계'
  | '실험계획법'
  | '통계적공정관리'
  | '구조적문제해결방법론'
  | '미니탭리터러시'
  | '파이썬리터러시'
  | '바이브코딩'
  | '머신러닝 이론'
  | '탐색적데이터분석'
  | '머신러닝 모델링'
  | 'AI Automation'
  | '시각화';

export interface ModuleConfig {
  id: ModuleId;
  prerequisites: ModuleId[];
  prerequisiteText?: string;
  hasOnline: boolean;
  hasOffline: boolean;
  isOfflineInDev?: boolean; // 실험계획법
  offlineType?: 'internal' | 'vegas'; // internal: 사내강사, vegas: 외부기관 베가스
  internalInstructors?: string[];
  vegasDates?: string[];
  onlineHunetInfo?: string;
}

export type Screen2Step =
  | 'PREREQUISITE_CHECK'
  | 'MODE_SELECT'
  | 'OFFLINE_INSTRUCTOR_SELECT'
  | 'OFFLINE_DATE_SELECT'
  | 'OFFLINE_DEV_NOTICE'
  | 'ONLINE_CONFIRM'
  | 'OFFLINE_CONFIRM'
  | 'COMPLETED';

export interface PromotionRequirement {
  g2Level: BadgeLevel | 0; // 0 = 미요구
  g3Level: BadgeLevel | 0; // 0 = 미요구
}

// ==========================================
// DATA & CONSTANTS
// ==========================================

export const USERS: {
  name: UserName;
  role: string;
  dept: string;
  avatarBg: string;
  group: '그룹1 (일반/공정)' | '그룹2 (AI/데이터)';
  jobCategory: '제조직군' | '비제조 직군';
}[] = [
  { name: '박지성', role: '주임 연구원 (G1)', dept: '디지털 혁신팀', avatarBg: 'bg-emerald-600', group: '그룹1 (일반/공정)', jobCategory: '제조직군' },
  { name: '이영표', role: '책임 엔지니어 (G2)', dept: '스마트 팩토리팀', avatarBg: 'bg-blue-600', group: '그룹1 (일반/공정)', jobCategory: '제조직군' },
  { name: '손흥민', role: '주임 연구원 (G1)', dept: '공정 데이터 분석팀', avatarBg: 'bg-amber-600', group: '그룹1 (일반/공정)', jobCategory: '제조직군' },
  { name: '류현진', role: '책임 데이터분석가 (G2)', dept: 'AI 데이터랩', avatarBg: 'bg-indigo-600', group: '그룹2 (AI/데이터)', jobCategory: '비제조 직군' },
  { name: '박찬호', role: '수석 마스터 (G3)', dept: 'GDX 아카데미', avatarBg: 'bg-rose-600', group: '그룹2 (AI/데이터)', jobCategory: '비제조 직군' },
];

export const MODULE_ORDER: ModuleId[] = [
  '기술통계',
  '추론통계',
  '실험계획법',
  '통계적공정관리',
  '구조적문제해결방법론',
  '미니탭리터러시',
  '파이썬리터러시',
  '바이브코딩',
  '머신러닝 이론',
  '탐색적데이터분석',
  '머신러닝 모델링',
  'AI Automation',
  '시각화',
];

// 류현진과 박찬호는 '실험계획법', '통계적공정관리', '구조적문제해결방법론', '미니탭리터러시' 모듈 제외
export const EXCLUDED_MODULES: Record<UserName, ModuleId[]> = {
  박지성: [],
  이영표: [],
  손흥민: [],
  류현진: ['실험계획법', '통계적공정관리', '구조적문제해결방법론', '미니탭리터러시'],
  박찬호: ['실험계획법', '통계적공정관리', '구조적문제해결방법론', '미니탭리터러시'],
};

export const getUserModules = (userName: UserName): ModuleId[] => {
  const excluded = EXCLUDED_MODULES[userName] || [];
  return MODULE_ORDER.filter((id) => !excluded.includes(id));
};

// Badge Level: 0: 없음, 1: 노랑, 2: 녹색, 3: 검정, 4: 실버크라운, 5: 골드크라운
export const MODULE_BADGES: Record<ModuleId, Record<UserName, BadgeLevel>> = {
  기술통계: {
    박지성: 2, // 녹색 (G2 OK)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 2, // 녹색 (G2 OK)
    류현진: 3, // 검정 (G2/G3 OK)
    박찬호: 5, // 골드 (G2/G3 OK)
  },
  추론통계: {
    박지성: 2, // 녹색 (G2 OK)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 2, // 녹색 (G2 OK)
    류현진: 3, // 검정 (G2/G3 OK)
    박찬호: 4, // 실버 (G2/G3 OK)
  },
  실험계획법: {
    박지성: 3, // 검정 (G2 OK)
    이영표: 3, // 검정 (G2 OK)
    손흥민: 1, // 노랑 (G2 미달)
    류현진: 0, // N/A
    박찬호: 0, // N/A
  },
  통계적공정관리: {
    박지성: 1, // 노랑 (G2 미달)
    이영표: 3, // 검정 (G2 OK)
    손흥민: 3, // 검정 (G2 OK)
    류현진: 0, // N/A
    박찬호: 0, // N/A
  },
  구조적문제해결방법론: {
    박지성: 3, // 검정 (G2 OK)
    이영표: 3, // 검정 (G2 OK)
    손흥민: 3, // 검정 (G2 OK)
    류현진: 0, // N/A
    박찬호: 0, // N/A
  },
  미니탭리터러시: {
    박지성: 2, // 녹색 (G2 OK)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 2, // 녹색 (G2 OK)
    류현진: 0, // N/A
    박찬호: 0, // N/A
  },
  파이썬리터러시: {
    박지성: 2, // 녹색 (G2 OK)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 2, // 녹색 (G2 OK)
    류현진: 4, // 실버 (G2/G3 OK)
    박찬호: 3, // 검정 (G2/G3 OK)
  },
  바이브코딩: {
    박지성: 2, // 녹색 (G2 OK)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 1, // 노랑 (G2 미달)
    류현진: 3, // 검정 (G2/G3 OK)
    박찬호: 4, // 실버 (G2/G3 OK)
  },
  '머신러닝 이론': {
    박지성: 0, // 미획득
    이영표: 2, // 녹색 (G3 OK)
    손흥민: 0, // 미획득
    류현진: 2, // 녹색 (G3 OK)
    박찬호: 3, // 검정 (G3 OK)
  },
  탐색적데이터분석: {
    박지성: 1, // 노랑 (G2 미달)
    이영표: 3, // 검정 (G2/G3 OK)
    손흥민: 2, // 녹색 (G2 OK)
    류현진: 3, // 검정 (G2/G3 OK)
    박찬호: 3, // 검정 (G2/G3 OK)
  },
  '머신러닝 모델링': {
    박지성: 0, // 미획득
    이영표: 1, // 노랑 (G3 미달)
    손흥민: 0, // 미획득
    류현진: 2, // 녹색 (G3 OK)
    박찬호: 2, // 녹색 (G3 OK)
  },
  'AI Automation': {
    박지성: 2, // 녹색
    이영표: 3, // 검정
    손흥민: 1, // 노랑
    류현진: 2, // 녹색 (G2 OK, G3 미달)
    박찬호: 3, // 검정 (G2/G3 OK)
  },
  시각화: {
    박지성: 0,
    이영표: 1,
    손흥민: 2,
    류현진: 3, // 검정 (G2/G3 OK)
    박찬호: 4, // 실버 (G2/G3 OK)
  },
};

export const MODULE_CONFIGS: Record<ModuleId, ModuleConfig> = {
  기술통계: {
    id: '기술통계',
    prerequisites: [],
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: '기술통계 온라인 과정은 휴넷에서 제공되는 통계학 개론 과정의 Chapter 1,2,3 에 해당합니다. 수강신청 하시겠습니까?',
  },
  추론통계: {
    id: '추론통계',
    prerequisites: ['기술통계'],
    prerequisiteText: "선행학습으로 '기술통계' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: '추론통계 온라인 과정은 휴넷에서 제공되는 통계학 개론 과정의 Chapter 4,5,6 에 해당합니다. 수강신청 하시겠습니까?',
  },
  실험계획법: {
    id: '실험계획법',
    prerequisites: ['기술통계', '추론통계'],
    prerequisiteText: "선행학습으로 '기술통계' , '추론통계' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    isOfflineInDev: true,
    onlineHunetInfo: '실험계획법 온라인 과정은 휴넷에서 제공되는 실험계획법 과정의 Chapter 1~4 에 해당합니다. 수강신청 하시겠습니까?',
  },
  통계적공정관리: {
    id: '통계적공정관리',
    prerequisites: ['기술통계', '추론통계'],
    prerequisiteText: "선행학습으로 '기술통계' , '추론통계' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: '통계적공정관리 온라인 과정은 휴넷에서 제공되는 SPC 개론 과정의 Chapter 1,2,3 에 해당합니다. 수강신청 하시겠습니까?',
  },
  구조적문제해결방법론: {
    id: '구조적문제해결방법론',
    prerequisites: [],
    prerequisiteText: '본 과정은 오프라인 교육만 제공되고 있습니다. 수강신청 하시겠습니까?',
    hasOnline: false,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['김영태', '지덱수', '기냥'],
  },
  미니탭리터러시: {
    id: '미니탭리터러시',
    prerequisites: ['기술통계', '추론통계', '통계적공정관리', '실험계획법'],
    prerequisiteText: "선행학습으로 '기술통계' , '추론통계' , '통계적공정관리', '실험계획법' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: '미니탭리터러시 온라인 과정은 휴넷에서 제공되는 미니탭 개론 과정의 Chapter 1~5 에 해당합니다. 수강신청 하시겠습니까?',
  },
  파이썬리터러시: {
    id: '파이썬리터러시',
    prerequisites: ['기술통계', '추론통계'],
    prerequisiteText: "선행학습으로 '기술통계' , '추론통계' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'vegas',
    vegasDates: [
      '2026년 08월 18일(화) ~ 08월 20일(목) [판교 교육장]',
      '2026년 09월 15일(화) ~ 09월 17일(목) [서울 교육장]',
      '2026년 10월 13일(화) ~ 10월 15일(목) [대전 교육장]',
    ],
    onlineHunetInfo: '파이썬리터러시 온라인 과정은 휴넷에서 제공되는 빅데이터분석기사 과정의 Chapter 1~3 에 해당합니다. 수강신청 하시겠습니까?',
  },
  바이브코딩: {
    id: '바이브코딩',
    prerequisites: ['파이썬리터러시'],
    prerequisiteText: "선행학습으로 '파이썬리터러시' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'vegas',
    vegasDates: [
      '2026년 08월 25일(화) ~ 08월 27일(목) [판교 교육장]',
      '2026년 09월 22일(화) ~ 09월 24일(목) [서울 교육장]',
      '2026년 10월 20일(화) ~ 10월 22일(목) [온라인 집체]',
    ],
    onlineHunetInfo: '바이브코딩 온라인 과정은 휴넷에서 제공되는 바이브코딩 마스터 과정에 해당합니다. 수강신청 하시겠습니까?',
  },
  '머신러닝 이론': {
    id: '머신러닝 이론',
    prerequisites: ['기술통계', '추론통계', '파이썬리터러시'],
    prerequisiteText: "선행학습으로 '기술통계', '추론통계', '파이썬리터러시' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'vegas',
    vegasDates: [
      '2026년 09월 01일(화) ~ 09월 03일(목) [판교 교육장]',
      '2026년 10월 06일(화) ~ 10월 08일(목) [서울 교육장]',
      '2026년 11월 03일(화) ~ 11월 05일(목) [판교 교육장]',
    ],
    onlineHunetInfo: '머신러닝 온라인 과정은 휴넷에서 제공되는 빅데이터분석기사 과정의 Chapter 1,2,3에 해당합니다. 수강신청 하시겠습니까?',
  },
  탐색적데이터분석: {
    id: '탐색적데이터분석',
    prerequisites: ['기술통계', '추론통계', '파이썬리터러시', '바이브코딩'],
    prerequisiteText: "선행학습으로 '기술통계', '추론통계', '파이썬리터러시', '바이브코딩' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'vegas',
    vegasDates: [
      '2026년 09월 08일(화) ~ 09월 10일(목) [서울 교육장]',
      '2026년 10월 13일(화) ~ 10월 15일(목) [판교 교육장]',
      '2026년 11월 10일(화) ~ 11월 12일(목) [온라인 집체]',
    ],
    onlineHunetInfo: '탐색적데이터분석 온라인 과정은 휴넷에서 제공되는 빅데이터분석기사 과정의 Chapter 4,5,6에 해당합니다. 수강신청 하시겠습니까?',
  },
  '머신러닝 모델링': {
    id: '머신러닝 모델링',
    prerequisites: ['기술통계', '추론통계', '파이썬리터러시', '바이브코딩', '머신러닝 이론', '탐색적데이터분석'],
    prerequisiteText: "선행학습으로 '기술통계', '추론통계', '파이썬리터러시', '바이브코딩', '머신러닝 이론', '탐색적데이터분석' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'vegas',
    vegasDates: [
      '2026년 09월 22일(화) ~ 09월 24일(목) [판교 교육장]',
      '2026년 10월 27일(화) ~ 10월 29일(목) [서울 교육장]',
      '2026년 11월 17일(화) ~ 11월 19일(목) [판교 교육장]',
    ],
    onlineHunetInfo: '머신러닝모델링 온라인 과정은 휴넷에서 제공되는 빅데이터분석기사 과정의 Chapter 7,8,9에 해당합니다. 수강신청 하시겠습니까?',
  },
  'AI Automation': {
    id: 'AI Automation',
    prerequisites: ['바이브코딩'],
    prerequisiteText: "선행학습으로 '바이브코딩' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: 'AI Automation 온라인 과정은 휴넷에서 제공되는 Streamlit 마스터 과정에 해당합니다. 수강신청 하시겠습니까?',
  },
  시각화: {
    id: '시각화',
    prerequisites: ['기술통계', '바이브코딩'],
    prerequisiteText: "선행학습으로 '기술통계', '바이브코딩' 과정이 요구됩니다. 수강신청 하시겠습니까?",
    hasOnline: true,
    hasOffline: true,
    offlineType: 'internal',
    internalInstructors: ['지덱수', '빤히', '기냥'],
    onlineHunetInfo: '시각화 온라인 과정은 휴넷에서 제공되는 Tableau 마스터 과정에 해당합니다. 수강신청 하시겠습니까?',
  },
};

export const BADGE_TYPES: BadgeType[] = ['노랑', '녹색', '검정', '실버크라운', '골드크라운'];

const MODULE_ICONS: Record<ModuleId, React.ReactNode> = {
  기술통계: <BarChart3 className="w-5 h-5 text-blue-600" />,
  추론통계: <LineChart className="w-5 h-5 text-indigo-600" />,
  실험계획법: <FlaskConical className="w-5 h-5 text-emerald-600" />,
  통계적공정관리: <Activity className="w-5 h-5 text-violet-600" />,
  구조적문제해결방법론: <Workflow className="w-5 h-5 text-amber-600" />,
  미니탭리터러시: <Binary className="w-5 h-5 text-cyan-600" />,
  파이썬리터러시: <Code2 className="w-5 h-5 text-yellow-600" />,
  바이브코딩: <Sparkles className="w-5 h-5 text-pink-600" />,
  '머신러닝 이론': <Brain className="w-5 h-5 text-purple-600" />,
  탐색적데이터분석: <SearchCode className="w-5 h-5 text-teal-600" />,
  '머신러닝 모델링': <Cpu className="w-5 h-5 text-rose-600" />,
  'AI Automation': <Bot className="w-5 h-5 text-sky-600" />,
  시각화: <PieChart className="w-5 h-5 text-orange-600" />,
};

// ==========================================
// PROMOTION REQUIREMENTS ENGINE
// ==========================================

export const getPromotionRequirements = (
  user: UserName
): Record<ModuleId, PromotionRequirement> => {
  const isGroup1 = user === '박지성' || user === '이영표' || user === '손흥민';

  if (isGroup1) {
    // Group 1 Requirements:
    // G2: 녹색(2) - 기술통계, 추론통계, 미니탭리터러시, 파이썬리터러시, 바이브코딩, 탐색적데이터분석
    // G2: 검정(3) - 구조적문제해결방법론, 실험계획법, 통계적공정관리
    // G3: 검정(3) - 기술통계, 추론통계, 미니탭리터러시, 파이썬리터러시, 바이브코딩, 탐색적데이터분석
    // G3: 녹색(2) - 머신러닝 이론, 머신러닝 모델링
    return {
      기술통계: { g2Level: 2, g3Level: 3 },
      추론통계: { g2Level: 2, g3Level: 3 },
      실험계획법: { g2Level: 3, g3Level: 0 },
      통계적공정관리: { g2Level: 3, g3Level: 0 },
      구조적문제해결방법론: { g2Level: 3, g3Level: 0 },
      미니탭리터러시: { g2Level: 2, g3Level: 3 },
      파이썬리터러시: { g2Level: 2, g3Level: 3 },
      바이브코딩: { g2Level: 2, g3Level: 3 },
      '머신러닝 이론': { g2Level: 0, g3Level: 2 },
      탐색적데이터분석: { g2Level: 2, g3Level: 3 },
      '머신러닝 모델링': { g2Level: 0, g3Level: 2 },
      'AI Automation': { g2Level: 0, g3Level: 0 },
      시각화: { g2Level: 0, g3Level: 0 },
    };
  } else {
    // Group 2 Requirements (류현진, 박찬호):
    // G2: 녹색(2) - 기술통계, 추론통계, 파이썬리터러시, 바이브코딩, 탐색적데이터분석, AI Automation, 시각화
    // G3: 검정(3) - 기술통계, 추론통계, 파이썬리터러시, 바이브코딩, 탐색적데이터분석, AI Automation, 시각화
    // G3: 녹색(2) - 머신러닝 이론, 머신러닝 모델링
    return {
      기술통계: { g2Level: 2, g3Level: 3 },
      추론통계: { g2Level: 2, g3Level: 3 },
      실험계획법: { g2Level: 0, g3Level: 0 },
      통계적공정관리: { g2Level: 0, g3Level: 0 },
      구조적문제해결방법론: { g2Level: 0, g3Level: 0 },
      미니탭리터러시: { g2Level: 0, g3Level: 0 },
      파이썬리터러시: { g2Level: 2, g3Level: 3 },
      바이브코딩: { g2Level: 2, g3Level: 3 },
      '머신러닝 이론': { g2Level: 0, g3Level: 2 },
      탐색적데이터분석: { g2Level: 2, g3Level: 3 },
      '머신러닝 모델링': { g2Level: 0, g3Level: 2 },
      'AI Automation': { g2Level: 2, g3Level: 3 },
      시각화: { g2Level: 2, g3Level: 3 },
    };
  }
};

export const evaluatePromotionStatus = (user: UserName) => {
  const reqs = getPromotionRequirements(user);
  const userModules = getUserModules(user);

  let g2MetCount = 0;
  let g2TotalCount = 0;
  const g2Missing: ModuleId[] = [];

  let g3MetCount = 0;
  let g3TotalCount = 0;
  const g3Missing: ModuleId[] = [];

  userModules.forEach((m) => {
    const userLv = MODULE_BADGES[m][user] || 0;
    const { g2Level, g3Level } = reqs[m];

    if (g2Level > 0) {
      g2TotalCount++;
      if (userLv >= g2Level) {
        g2MetCount++;
      } else {
        g2Missing.push(m);
      }
    }

    if (g3Level > 0) {
      g3TotalCount++;
      if (userLv >= g3Level) {
        g3MetCount++;
      } else {
        g3Missing.push(m);
      }
    }
  });

  const isG2Passed = g2TotalCount > 0 && g2MetCount === g2TotalCount;
  const isG3Passed = g3TotalCount > 0 && g3MetCount === g3TotalCount;

  let currentRank = 'G1 (주임급)';
  if (isG3Passed) {
    currentRank = 'G3 (수석급)';
  } else if (isG2Passed) {
    currentRank = 'G2 (책임급)';
  }

  return {
    currentRank,
    isG2Passed,
    isG3Passed,
    g2MetCount,
    g2TotalCount,
    g2Missing,
    g3MetCount,
    g3TotalCount,
    g3Missing,
  };
};

// ==========================================
// SUB-COMPONENTS
// ==========================================

interface KolonBadgeProps {
  type: BadgeType;
  isObtained: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const KolonBadge: React.FC<KolonBadgeProps> = ({
  type,
  isObtained,
  size = 'md',
  showLabel = false,
}) => {
  const dimensions = {
    sm: { box: 'w-6 h-6', svg: 26, text: 'text-[9px]' },
    md: { box: 'w-9 h-9', svg: 36, text: 'text-[10px]' },
    lg: { box: 'w-12 h-12', svg: 48, text: 'text-xs' },
  }[size];

  const badgeStyles = {
    노랑: { gradientId: 'kolonYellow', stroke: '#D97706', label: '노랑' },
    녹색: { gradientId: 'kolonGreen', stroke: '#047857', label: '녹색' },
    검정: { gradientId: 'kolonBlack', stroke: '#111827', label: '검정' },
    실버크라운: { gradientId: 'kolonSilver', stroke: '#374151', label: '실버크라운' },
    골드크라운: { gradientId: 'kolonGold', stroke: '#78350F', label: '골드크라운' },
  }[type];

  const hasCrown = type === '실버크라운' || type === '골드크라운';
  const isGold = type === '골드크라운';

  return (
    <div className="inline-flex flex-col items-center justify-center gap-0.5">
      <div
        className={`relative flex items-center justify-center transition-all duration-200 ${
          isObtained ? 'hover:scale-110 cursor-pointer drop-shadow-2xs' : 'opacity-40 grayscale'
        }`}
        title={`${type} 배지 ${isObtained ? '(획득)' : '(미획득)'}`}
      >
        <svg
          width={dimensions.svg}
          height={dimensions.svg}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="kolonGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF066" />
              <stop offset="45%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>

            <linearGradient id="kolonSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#9CA3AF" />
              <stop offset="100%" stopColor="#374151" />
            </linearGradient>

            <linearGradient id="kolonYellow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <linearGradient id="kolonGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A7F3D0" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            <linearGradient id="kolonBlack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="60%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>
          </defs>

          {isObtained ? (
            <g>
              <g strokeLinejoin="round" strokeLinecap="round">
                <path
                  d="M50 8 C52 8 53.5 10 74 46 C75.5 48.5 74.5 52 71.5 52 H28.5 C25.5 52 24.5 48.5 26 46 Z"
                  fill={`url(#${badgeStyles.gradientId})`}
                  stroke={badgeStyles.stroke}
                  strokeWidth="2"
                />
                <path
                  d="M10 26 C8.5 26 7 28 15.5 75 C17 78 20.5 79 23.5 76.5 L64.5 41 C67 39 66 36 63 36 H14 Z"
                  fill={`url(#${badgeStyles.gradientId})`}
                  stroke={badgeStyles.stroke}
                  strokeWidth="2"
                />
                <path
                  d="M90 26 C91.5 26 93 28 84.5 75 C83 78 79.5 79 76.5 76.5 L35.5 41 C33 39 34 36 37 36 H86 Z"
                  fill={`url(#${badgeStyles.gradientId})`}
                  stroke={badgeStyles.stroke}
                  strokeWidth="2"
                />

                <path
                  d="M50 8 L76 52 H24 Z M10 28 H64 L24 92 Z M90 28 H36 L76 92 Z"
                  fill={`url(#${badgeStyles.gradientId})`}
                />

                <path d="M50 20 L64 44 H36 Z" fill="#FFFFFF" className="drop-shadow-2xs" />
                <path d="M26 44 L38 66 H14 Z" fill="#FFFFFF" className="drop-shadow-2xs" />
                <path d="M74 44 L86 66 H62 Z" fill="#FFFFFF" className="drop-shadow-2xs" />

                <path d="M50 10 L68 40 H32 Z" fill="#FFFFFF" fillOpacity="0.3" />
              </g>

              {hasCrown && (
                <g transform="translate(26, -10)">
                  <path
                    d="M0 24 L10 6 L24 18 L38 6 L48 24 L42 30 L6 30 Z"
                    fill={isGold ? '#F59E0B' : '#4B5563'}
                    opacity="0.3"
                    transform="translate(1, 2)"
                  />
                  <path
                    d="M0 24 L10 6 L24 18 L38 6 L48 24 L42 30 L6 30 Z"
                    fill={isGold ? 'url(#kolonGold)' : 'url(#kolonSilver)'}
                    stroke={isGold ? '#78350F' : '#111827'}
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <circle cx="10" cy="5" r="3.5" fill={isGold ? '#EF4444' : '#E5E7EB'} stroke={isGold ? '#78350F' : '#374151'} strokeWidth="1" />
                  <circle cx="24" cy="16" r="3.5" fill={isGold ? '#3B82F6' : '#9CA3AF'} stroke={isGold ? '#78350F' : '#374151'} strokeWidth="1" />
                  <circle cx="38" cy="5" r="3.5" fill={isGold ? '#EF4444' : '#E5E7EB'} stroke={isGold ? '#78350F' : '#374151'} strokeWidth="1" />
                </g>
              )}
            </g>
          ) : (
            <g opacity="0.5">
              <g strokeLinejoin="round" strokeLinecap="round">
                <path
                  d="M50 8 L76 52 H24 Z M10 28 H64 L24 92 Z M90 28 H36 L76 92 Z"
                  fill="none"
                  stroke="#6B7280"
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />

                <path
                  d="M50 20 L64 44 H36 Z"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <path
                  d="M26 44 L38 66 H14 Z"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <path
                  d="M74 44 L86 66 H62 Z"
                  fill="none"
                  stroke="#9CA3AF"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </g>

              {hasCrown && (
                <g transform="translate(26, -10)">
                  <path
                    d="M0 24 L10 6 L24 18 L38 6 L48 24 Z"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                  <circle cx="10" cy="5" r="2" fill="none" stroke="#9CA3AF" strokeWidth="1" />
                  <circle cx="24" cy="16" r="2" fill="none" stroke="#9CA3AF" strokeWidth="1" />
                  <circle cx="38" cy="5" r="2" fill="none" stroke="#9CA3AF" strokeWidth="1" />
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {showLabel && (
        <span
          className={`font-semibold tracking-tighter ${dimensions.text} ${
            isObtained ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'
          }`}
        >
          {type}
        </span>
      )}
    </div>
  );
};

// ==========================================
// PROMOTION CRITERIA MODAL COMPONENT
// ==========================================

interface PromotionCriteriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserName;
}

export const PromotionCriteriaModal: React.FC<PromotionCriteriaModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600/30 rounded-xl border border-indigo-500/40 text-indigo-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                GDX 직급별 (G2/G3) 필수 배지 승격 기준 안내
              </h2>
              <p className="text-xs text-slate-400">
                직급 승격을 위한 트랙별(그룹1 / 그룹2) 필수 배지 요구사항
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs md:text-sm">
          {/* Active User Highlight */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                현재 선택된 사용자
              </span>
              <span className="text-base font-extrabold text-slate-900">
                {currentUser} 님 ({USERS.find((u) => u.name === currentUser)?.group})
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">적용 대상 모듈</span>
              <span className="text-xs font-bold text-indigo-700">
                총 {getUserModules(currentUser).length}개 모듈
              </span>
            </div>
          </div>

          {/* Group 1 Standard */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-900 border-b border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-emerald-600" />
                그룹 1: 박지성, 이영표, 손흥민 (일반 / 공정 엔지니어 트랙)
              </span>
              <span className="text-[10px] font-normal text-slate-500">13개 모듈 전체 대상</span>
            </div>
            <div className="p-4 space-y-3 bg-white">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  G2 (책임급) 승격 조건
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                  <li>
                    <strong className="text-slate-900">녹색 배지 이상 (6개)</strong>: 기술통계, 추론통계, 미니탭리터러시, 파이썬리터러시, 바이브코딩, 탐색적데이터분석
                  </li>
                  <li>
                    <strong className="text-slate-900">블랙 배지 이상 (3개)</strong>: 구조적문제해결방법론, 실험계획법, 통계적공정관리
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
                <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  G3 (수석급) 승격 조건
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                  <li>
                    <strong className="text-slate-900">블랙 배지 이상 (6개)</strong>: 기술통계, 추론통계, 미니탭리터러시, 파이썬리터러시, 바이브코딩, 탐색적데이터분석
                  </li>
                  <li>
                    <strong className="text-slate-900">녹색 배지 이상 (2개)</strong>: 머신러닝 이론, 머신러닝 모델링
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Group 2 Standard */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-900 border-b border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                그룹 2: 류현진, 박찬호 (AI / 데이터 트랙)
              </span>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                실험계획법, 통계적공정관리, 구조적문제해결방법론, 미니탭리터러시 제외 (9개 모듈 대상)
              </span>
            </div>
            <div className="p-4 space-y-3 bg-white">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
                <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  G2 (책임급) 승격 조건
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                  <li>
                    <strong className="text-slate-900">녹색 배지 이상 (7개)</strong>: 기술통계, 추론통계, 파이썬리터러시, 바이브코딩, 탐색적데이터분석, AI Automation, 시각화
                  </li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/60">
                <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1">
                  <Award className="w-4 h-4 text-indigo-600" />
                  G3 (수석급) 승격 조건
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-xs">
                  <li>
                    <strong className="text-slate-900">블랙 배지 이상 (7개)</strong>: 기술통계, 추론통계, 파이썬리터러시, 바이브코딩, 탐색적데이터분석, AI Automation, 시각화
                  </li>
                  <li>
                    <strong className="text-slate-900">녹색 배지 이상 (2개)</strong>: 머신러닝 이론, 머신러닝 모델링
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// HEADER COMPONENT
// ==========================================

interface HeaderProps {
  currentUser: UserName;
  onSelectUser: (name: UserName) => void;
  onRandomUser: () => void;
  onOpenCriteria: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSelectUser,
  onRandomUser,
  onOpenCriteria,
}) => {
  const activeUserData = USERS.find((u) => u.name === currentUser) || USERS[0];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md px-3 md:px-6 py-2.5 shrink-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-md border border-red-400/30 p-1.5 shrink-0">
            <svg
              width="24"
              height="24"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g strokeLinejoin="round" strokeLinecap="round">
                <path
                  d="M50 8 L76 52 H24 Z M10 28 H64 L24 92 Z M90 28 H36 L76 92 Z"
                  fill="#FFFFFF"
                />
                <path d="M50 20 L64 44 H36 Z" fill="#DC2626" />
                <path d="M26 44 L38 66 H14 Z" fill="#DC2626" />
                <path d="M74 44 L86 66 H62 Z" fill="#DC2626" />
              </g>
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-black tracking-tight text-white leading-none">
                GDX 아카데미
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                수강 신청 및 배지 현황
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden lg:block mt-0.5">
              코오롱 GDX 모듈별 배지 현황 & G1/G2/G3 직급 승격 기준선 관리
            </p>
          </div>
        </div>

        {/* Job Category Display */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
          <span className="text-[10px] text-slate-400">직군 구분:</span>
          <span
            className={`text-xs font-black px-2.5 py-0.5 rounded-full text-white shadow-2xs ${
              activeUserData.jobCategory === '제조직군'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400/30'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 border border-indigo-400/30'
            }`}
          >
            {activeUserData.jobCategory}
          </span>
          <button
            onClick={onOpenCriteria}
            className="flex items-center gap-1 text-[11px] text-indigo-300 hover:text-white underline cursor-pointer ml-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>승격 기준</span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-1.5 shadow-xs">
            <div
              className={`w-7 h-7 rounded-lg ${activeUserData.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0`}
            >
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white leading-none">
                {activeUserData.name} 프로
              </div>
            </div>
          </div>

          <button
            onClick={onRandomUser}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-2.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            title="랜덤 접속 사용자 새로고침"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">랜덤 접속</span>
          </button>
        </div>
      </div>
    </header>
  );
};

// ==========================================
// BADGE MATRIX COMPONENT
// ==========================================

interface BadgeMatrixProps {
  currentUser: UserName;
  onOpenCriteria: () => void;
  onSelectModule: (id: ModuleId) => void;
}

export const BadgeMatrix: React.FC<BadgeMatrixProps> = ({
  currentUser,
  onOpenCriteria,
  onSelectModule,
}) => {
  const activeModules = getUserModules(currentUser);
  const reqs = getPromotionRequirements(currentUser);
  const status = evaluatePromotionStatus(currentUser);
  const userObj = USERS.find((u) => u.name === currentUser);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-3.5 md:p-4 flex flex-col gap-3">
      {/* Top Header & Promotion Status Summary */}
      <div className="flex flex-col gap-2 border-b border-slate-100 pb-2 mb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg text-white shadow-xs shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                  {currentUser} 님의 모듈별 배지 획득 현황 및 수강신청
                </h2>
              </div>
              <p className="text-[11px] text-slate-500">
                각 모듈별 배지 획득 현황(G2/G3 기준선)을 확인하고 바로 수강신청할 수 있습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCriteria}
            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>G2/G3 필수 기준선 상세 보기</span>
          </button>
        </div>

        {/* Promotion Status Progress Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50/90 p-2 rounded-xl border border-slate-200/80">
          {/* G2 Standard Status */}
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">
                  G2 (책임급) 필수조건
                </span>
                <span className="text-xs font-black text-slate-800">
                  {status.g2MetCount} / {status.g2TotalCount} 모듈 달성 ({Math.round((status.g2MetCount / status.g2TotalCount) * 100)}%)
                </span>
              </div>
            </div>

            {status.isG2Passed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                G2 조건 충족 ✅
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {status.g2Missing.length}개 부족 (미달)
              </span>
            )}
          </div>

          {/* G3 Standard Status */}
          <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200/60 shadow-2xs">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">
                  G3 (수석급) 필수조건
                </span>
                <span className="text-xs font-black text-slate-800">
                  {status.g3MetCount} / {status.g3TotalCount} 모듈 달성 ({Math.round((status.g3MetCount / status.g3TotalCount) * 100)}%)
                </span>
              </div>
            </div>

            {status.isG3Passed ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                G3 조건 충족 👑
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {status.g3Missing.length}개 부족 (미달)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Unified Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activeModules.map((moduleId) => {
          const config = MODULE_CONFIGS[moduleId];
          const hasPrereqs = config.prerequisites.length > 0;
          const userLevel: BadgeLevel = MODULE_BADGES[moduleId][currentUser] || 0;
          const req = reqs[moduleId];
          const hasG2Req = req.g2Level > 0;
          const hasG3Req = req.g3Level > 0;
          const isG2Met = hasG2Req && userLevel >= req.g2Level;
          const isG3Met = hasG3Req && userLevel >= req.g3Level;

          return (
            <div
              key={moduleId}
              className="bg-white/95 hover:bg-white transition-all duration-200 rounded-2xl p-3 border border-slate-200/90 shadow-2xs hover:shadow-md flex flex-col justify-between gap-2.5 group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between gap-1.5 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-200/60 shrink-0">
                    {MODULE_ICONS[moduleId]}
                  </div>
                  <div className="min-w-0">
                    <h3
                      className="font-extrabold text-xs md:text-sm text-slate-900 tracking-tight truncate group-hover:text-indigo-700 transition-colors"
                      title={moduleId}
                    >
                      {moduleId}
                    </h3>
                    <p className="text-[10px] text-slate-500 truncate">
                      {hasPrereqs ? (
                        <span className="text-amber-700 font-medium">
                          선행: {config.prerequisites.join(', ')}
                        </span>
                      ) : (
                        <span className="text-slate-400">선행 조건 없음</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Level Status Badge */}
                {userLevel > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    {userLevel === 5
                      ? '골드'
                      : userLevel === 4
                      ? '실버'
                      : userLevel === 3
                      ? '검정'
                      : userLevel === 2
                      ? '녹색'
                      : '노랑'}
                  </span>
                ) : (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0 border border-slate-200/60">
                    미획득
                  </span>
                )}
              </div>

              {/* Badge Visual Row */}
              <div className="flex flex-col bg-slate-50/80 p-2 rounded-xl border border-slate-200/60 gap-1">
                <div className="flex items-center justify-between px-0.5">
                  {BADGE_TYPES.map((badgeType, index) => {
                    const requiredLevel = (index + 1) as BadgeLevel;
                    const isObtained = userLevel >= requiredLevel;
                    const isG2Line = req.g2Level === requiredLevel;
                    const isG3Line = req.g3Level === requiredLevel;

                    return (
                      <div key={badgeType} className="flex flex-col items-center relative">
                        <KolonBadge
                          type={badgeType}
                          isObtained={isObtained}
                          size="sm"
                        />

                        {/* Baseline Markers under badges */}
                        <div className="flex items-center gap-0.5 mt-0.5 h-3">
                          {isG2Line && (
                            <span
                              className={`text-[8px] font-extrabold px-1 rounded ${
                                isG2Met
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                              title={`G2 기준: ${badgeType}배지 이상`}
                            >
                              G2
                            </span>
                          )}
                          {isG3Line && (
                            <span
                              className={`text-[8px] font-extrabold px-1 rounded ${
                                isG3Met
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-200 text-slate-700 border border-slate-300'
                              }`}
                              title={`G3 기준: ${badgeType}배지 이상`}
                            >
                              G3
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Requirement Summary & Direct Enrollment Button */}
              <div className="flex flex-col gap-1.5 pt-0.5">
                <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                  <div className="flex items-center gap-1 font-semibold flex-wrap">
                    {hasG2Req && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] ${
                          isG2Met
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        G2:{req.g2Level === 2 ? '녹색' : '검정'}
                      </span>
                    )}
                    {hasG3Req && (
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] ${
                          isG3Met
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        G3:{req.g3Level === 2 ? '녹색' : '검정'}
                      </span>
                    )}
                    {!hasG2Req && !hasG3Req && (
                      <span className="text-slate-400 font-normal text-[9px]">자율 과목</span>
                    )}
                  </div>
                </div>

                {/* Enrollment Button */}
                <button
                  onClick={() => onSelectModule(moduleId)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-100 border border-slate-700/50 rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer group/btn"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-300 group-hover/btn:text-indigo-200" />
                  <span>수강신청 알아보기</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-300 group-hover/btn:text-indigo-200 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// MODULE GRID COMPONENT
// ==========================================

interface ModuleGridProps {
  currentUser: UserName;
  onSelectModule: (id: ModuleId) => void;
}

export const ModuleGrid: React.FC<ModuleGridProps> = ({
  currentUser,
  onSelectModule,
}) => {
  const activeModules = getUserModules(currentUser);
  const reqs = getPromotionRequirements(currentUser);

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xs p-3.5 md:p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <div>
          <h2 className="text-base md:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>GDX 교육 과정 수강 신청</span>
            <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200/60">
              클릭하여 신청 진행 ({currentUser} 님 대상 {activeModules.length}개 과목)
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            원하는 교육 모듈 박스를 클릭하면 상세 과정(온/오프라인) 선택 화면으로 연결됩니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {activeModules.map((id) => {
          const config = MODULE_CONFIGS[id];
          const hasPrereqs = config.prerequisites.length > 0;
          const userLevel = MODULE_BADGES[id][currentUser] || 0;
          const req = reqs[id];

          return (
            <button
              key={id}
              onClick={() => onSelectModule(id)}
              className="group relative text-left bg-gradient-to-br from-white to-slate-50/80 hover:from-indigo-50/50 hover:to-blue-50/50 border border-slate-200/90 hover:border-indigo-400/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-indigo-500/40"
            >
              <div className="flex items-center justify-between w-full">
                <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-white transition-colors border border-slate-200/50 shadow-2xs">
                  {MODULE_ICONS[id]}
                </div>
                <div className="flex items-center gap-1">
                  {hasPrereqs && (
                    <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" />
                      선행
                    </span>
                  )}
                  <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white transition-all flex items-center justify-center">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {id}
                  </h3>
                </div>

                {/* Promotion Requirement Tag */}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {req.g2Level > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      G2필수({req.g2Level === 2 ? '녹색' : '검정'})
                    </span>
                  )}
                  {req.g3Level > 0 && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      G3필수({req.g3Level === 2 ? '녹색' : '검정'})
                    </span>
                  )}
                  {req.g2Level === 0 && req.g3Level === 0 && (
                    <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-500">
                      자율 과목
                    </span>
                  )}
                </div>

                {hasPrereqs ? (
                  <p className="text-[10px] text-slate-500 truncate mt-1">
                    선행: {config.prerequisites.join(', ')}
                  </p>
                ) : (
                  <p className="text-[10px] text-emerald-600 font-medium mt-1">
                    선행 요구 조건 없음
                  </p>
                )}
              </div>

              <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">현재 보유:</span>
                <span
                  className={`font-semibold ${
                    userLevel > 0 ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {userLevel === 5
                    ? '골드크라운'
                    : userLevel === 4
                    ? '실버크라운'
                    : userLevel === 3
                    ? '검정 배지'
                    : userLevel === 2
                    ? '녹색 배지'
                    : userLevel === 1
                    ? '노랑 배지'
                    : '배지 없음'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// COURSE ENROLLMENT MODAL SCREEN
// ==========================================

interface CourseEnrollmentModalProps {
  moduleId: ModuleId;
  currentUser: UserName;
  onBackToMain: () => void;
}

export const CourseEnrollmentModal: React.FC<CourseEnrollmentModalProps> = ({
  moduleId,
  currentUser,
  onBackToMain,
}) => {
  const config = MODULE_CONFIGS[moduleId];

  const initialStep: Screen2Step =
    config.prerequisiteText || config.prerequisites.length > 0
      ? 'PREREQUISITE_CHECK'
      : 'MODE_SELECT';

  const [step, setStep] = useState<Screen2Step>(initialStep);
  const [selectedMode, setSelectedMode] = useState<'online' | 'offline' | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [completionMessage, setCompletionMessage] = useState<string>('');

  const handlePrereqYes = () => {
    if (moduleId === '구조적문제해결방법론') {
      setSelectedMode('offline');
      setStep('OFFLINE_INSTRUCTOR_SELECT');
    } else {
      setStep('MODE_SELECT');
    }
  };

  const handleSelectMode = (mode: 'online' | 'offline') => {
    setSelectedMode(mode);
    if (mode === 'online') {
      setStep('ONLINE_CONFIRM');
    } else {
      if (config.isOfflineInDev) {
        setStep('OFFLINE_DEV_NOTICE');
      } else if (config.offlineType === 'internal') {
        setStep('OFFLINE_INSTRUCTOR_SELECT');
      } else if (config.offlineType === 'vegas') {
        setStep('OFFLINE_DATE_SELECT');
      }
    }
  };

  const handleInstructorClick = (instructor: string) => {
    setSelectedInstructor(instructor);
    setStep('OFFLINE_CONFIRM');
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setStep('OFFLINE_CONFIRM');
  };

  const handleConfirmOfflineYes = () => {
    let msg = '수강신청이 완료되었습니다. 오프라인 교육은 강사의 안내에 따라 과제를 제출하여 평가에 응하시기 바랍니다.';
    if (config.offlineType === 'vegas' && selectedDate) {
      msg = `(${selectedDate}) 수강신청이 완료되었습니다. 오프라인 교육은 강사의 안내에 따라 과제를 제출하여 평가에 응하시기 바랍니다.`;
    }
    setCompletionMessage(msg);
    setStep('COMPLETED');
  };

  const handleConfirmOnlineYes = () => {
    const msg =
      '수강신청이 완료되었습니다. 온라인 교육은 강의 종료일로부터 한 달 이내에 두 번의 응시 기회가 부여됩니다.';
    setCompletionMessage(msg);
    setStep('COMPLETED');
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center justify-center p-4 md:p-8 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto transition-all">
        <div className="bg-slate-900 text-white p-5 md:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMain}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>첫 화면으로</span>
            </button>
            <div className="h-5 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {moduleId} 수강신청
              </h1>
            </div>
          </div>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            신청자: {currentUser}
          </span>
        </div>

        <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[420px] text-center bg-gradient-to-b from-white via-slate-50/50 to-slate-100/50">
          {step === 'PREREQUISITE_CHECK' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                <HelpCircle className="w-9 h-9" />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  선행 요구사항 확인
                </span>
                <p className="text-xl md:text-2xl font-bold text-slate-900 leading-relaxed px-4">
                  "{config.prerequisiteText}"
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 w-full pt-4 max-w-md">
                <button
                  onClick={onBackToMain}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base transition-all border border-slate-300/80 cursor-pointer"
                >
                  아니오
                </button>
                <button
                  onClick={handlePrereqYes}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer"
                >
                  예
                </button>
              </div>
            </div>
          )}

          {step === 'MODE_SELECT' && (
            <div className="w-full max-w-2xl flex flex-col items-center gap-8 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  교육 형태 선택
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                  원하시는 수강 방식을 선택해주세요
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {config.hasOnline && (
                  <button
                    onClick={() => handleSelectMode('online')}
                    className="group bg-white hover:bg-indigo-50/70 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-4 text-center cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                      <Monitor className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700">
                        온라인 과정
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        휴넷 e-러닝 콘텐츠 / 언제 어디서나 자율 수강
                      </p>
                    </div>
                  </button>
                )}

                {config.hasOffline && (
                  <button
                    onClick={() => handleSelectMode('offline')}
                    className="group bg-white hover:bg-emerald-50/70 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col items-center gap-4 text-center cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 group-hover:scale-110 transition-transform flex items-center justify-center">
                      <Users className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700">
                        오프라인 과정
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {config.offlineType === 'internal'
                          ? '사내 전문강사 집체 교육 & 과제 평가'
                          : '외부 전문기관(베가스) 실습 집체교육'}
                      </p>
                    </div>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (config.prerequisiteText) {
                    setStep('PREREQUISITE_CHECK');
                  } else {
                    onBackToMain();
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
              >
                이전 단계로 이동
              </button>
            </div>
          )}

          {step === 'OFFLINE_DEV_NOTICE' && (
            <div className="w-full max-w-lg flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shadow-inner">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  안내
                </span>
                <p className="text-xl font-bold text-slate-900 leading-relaxed">
                  실험계획법 오프라인 과정은 현재 개발중에 있습니다. 온라인 과정을 이용해 주세요.
                </p>
              </div>

              <button
                onClick={() => setStep('MODE_SELECT')}
                className="py-3.5 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-all cursor-pointer mt-2"
              >
                이전화면으로 돌아가기
              </button>
            </div>
          )}

          {step === 'OFFLINE_INSTRUCTOR_SELECT' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  사내강사 선택
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  수강을 희망하시는 사내강사를 클릭해주세요
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full pt-2">
                {config.internalInstructors?.map((instructor) => (
                  <button
                    key={instructor}
                    onClick={() => handleInstructorClick(instructor)}
                    className="group bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center font-bold text-lg transition-colors">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-medium block">
                        GDX 전문강사
                      </span>
                      <span className="text-lg font-black text-slate-900 group-hover:text-emerald-700">
                        {instructor} 강사
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (moduleId === '구조적문제해결방법론') {
                    setStep('PREREQUISITE_CHECK');
                  } else {
                    setStep('MODE_SELECT');
                  }
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer pt-2"
              >
                이전 단계로 이동
              </button>
            </div>
          )}

          {step === 'OFFLINE_DATE_SELECT' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadeIn">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  외부 교육기관 (베가스) 집체교육
                </span>
                <p className="text-xl font-bold text-slate-900 leading-snug">
                  {moduleId} 오프라인 과정은 외부교육기관(베가스)의 집체교육입니다.
                  <br />
                  <span className="text-indigo-600 font-black">
                    신청하고자 하는 날짜를 선택하세요.
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full pt-2">
                {config.vegasDates?.map((dateStr) => (
                  <button
                    key={dateStr}
                    onClick={() => handleDateClick(dateStr)}
                    className="group bg-white hover:bg-indigo-50 border-2 border-slate-200 hover:border-indigo-500 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="text-sm md:text-base font-bold text-slate-800 group-hover:text-indigo-900">
                        {dateStr}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
                      선택하기
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('MODE_SELECT')}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer pt-2"
              >
                이전 단계로 이동
              </button>
            </div>
          )}

          {step === 'OFFLINE_CONFIRM' && (
            <div className="w-full max-w-lg flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <HelpCircle className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  최종 신청 확인
                </span>
                {selectedInstructor && (
                  <p className="text-sm text-slate-500 font-medium">
                    선택강사: <strong className="text-slate-800">{selectedInstructor} 강사</strong>
                  </p>
                )}
                {selectedDate && (
                  <p className="text-sm text-slate-500 font-medium">
                    선택일자: <strong className="text-slate-800">{selectedDate}</strong>
                  </p>
                )}
                <h2 className="text-2xl font-black text-slate-900 pt-1">
                  수강신청하시겠습니까?
                </h2>
              </div>

              <div className="flex items-center justify-center gap-4 w-full max-w-md pt-2">
                <button
                  onClick={() => {
                    if (config.offlineType === 'internal') {
                      setStep('OFFLINE_INSTRUCTOR_SELECT');
                    } else {
                      setStep('OFFLINE_DATE_SELECT');
                    }
                  }}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base border border-slate-300 transition-all cursor-pointer"
                >
                  아니오
                </button>
                <button
                  onClick={handleConfirmOfflineYes}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all cursor-pointer"
                >
                  예
                </button>
              </div>
            </div>
          )}

          {step === 'ONLINE_CONFIRM' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                <Monitor className="w-9 h-9" />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  온라인 휴넷 과정 안내
                </span>
                <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100">
                  <p className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed">
                    "{config.onlineHunetInfo}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 w-full max-w-md pt-2">
                <button
                  onClick={() => setStep('MODE_SELECT')}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-base border border-slate-300 transition-all cursor-pointer"
                >
                  아니오
                </button>
                <button
                  onClick={handleConfirmOnlineYes}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all cursor-pointer"
                >
                  예
                </button>
              </div>
            </div>
          )}

          {step === 'COMPLETED' && (
            <div className="w-full max-w-xl flex flex-col items-center gap-6 animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  수강 신청 완료
                </span>
                <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500/30 shadow-md">
                  <p className="text-lg md:text-xl font-black text-slate-900 leading-relaxed">
                    {completionMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md pt-4">
                <button
                  onClick={onBackToMain}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md transition-all cursor-pointer"
                >
                  메인 화면으로 이동
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN ROOT APP COMPONENT
// ==========================================

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserName>('박지성');
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState<boolean>(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * USERS.length);
    setCurrentUser(USERS[randomIndex].name);
  }, []);

  const handleRandomUser = () => {
    const availableUsers = USERS.map((u) => u.name);
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    setCurrentUser(availableUsers[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans select-none">
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        onRandomUser={handleRandomUser}
        onOpenCriteria={() => setIsCriteriaOpen(true)}
      />

      {activeModule ? (
        <main className="flex-1 overflow-y-auto bg-slate-200/60 p-2 sm:p-4 flex items-center justify-center">
          <CourseEnrollmentModal
            moduleId={activeModule}
            currentUser={currentUser}
            onBackToMain={() => setActiveModule(null)}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col gap-4 p-3 md:p-5 max-w-7xl mx-auto w-full">
          <section className="w-full">
            <BadgeMatrix
              currentUser={currentUser}
              onOpenCriteria={() => setIsCriteriaOpen(true)}
              onSelectModule={(id) => setActiveModule(id)}
            />
          </section>
        </main>
      )}

      <PromotionCriteriaModal
        isOpen={isCriteriaOpen}
        onClose={() => setIsCriteriaOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
