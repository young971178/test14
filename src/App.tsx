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
  FileText,
  UserPlus,
  Search,
  Building2,
  Clock,
  Briefcase,
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

// ==========================================
// PROJECT MENTORING DATA MODEL & INITIAL DATA
// ==========================================

export interface ProjectItem {
  id: number;
  category: '제조직군' | '비제조직군';
  module: ModuleId;
  title: string;
  assignee: string;
  department: string;
  status: '기획' | '진행중' | '검증' | '완료예정' | '작성중';
  mentor: string;
  needsMentor: boolean;
  background: string;
  target: string;
  period: string;
  techStack: string;
}

export const INITIAL_PROJECTS: ProjectItem[] = [
  // 1. 기술통계 (5개)
  {
    id: 1,
    category: '제조직군',
    module: '기술통계',
    title: '스마트 라인 공정 데이터 실시간 이상 탐지 및 변동성 분석',
    assignee: '김철수',
    department: '생산기술1팀',
    status: '진행중',
    mentor: '박지성',
    needsMentor: false,
    background: '생산 라인 수율 변동 최소화를 위한 실시간 공정 수치 이상 징후 감지 및 통계적 한계선 수립',
    target: '공정 불량률 12% 감소 및 이상 징후 사전 경보',
    period: '2026.08 ~ 2026.11',
    techStack: '기술통계, Minitab, Python',
  },
  {
    id: 2,
    category: '제조직군',
    module: '기술통계',
    title: '조립 공정 사이클 타임 병목 구간 데이터 산출 및 표준화',
    assignee: '한상우',
    department: '생산1팀',
    status: '완료예정',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '라인별 서브 조립 시간 산출 및 공정 평행도(Line Balancing) 개선',
    target: '라인 생산성(UPH) 10% 향상',
    period: '2026.06 ~ 2026.09',
    techStack: '기술통계, Line Balancing',
  },
  {
    id: 3,
    category: '제조직군',
    module: '기술통계',
    title: '반도체 웨이퍼 패키징 두께 산패도 통계 지표 산출',
    assignee: '박재현',
    department: '패키징기술팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '패키징 공정 도막 두께 정밀 데이터 수집 및 기술통계 기반 산패도 평가지표 수립',
    target: '두께 편차 15% 감소',
    period: '2026.09 ~ 2026.12',
    techStack: '기술통계, Minitab',
  },
  {
    id: 4,
    category: '비제조직군',
    module: '기술통계',
    title: 'CRM 고객 구매 주기 및 이탈율 기술통계 패턴 분석',
    assignee: '최지우',
    department: '마케팅전략팀',
    status: '진행중',
    mentor: '이영표',
    needsMentor: false,
    background: '고객 활성도 기술통계 파악을 통한 재구매 주기 측정 및 리텐션 지표 표준화',
    target: '고객 재구매율 8% 상승',
    period: '2026.08 ~ 2026.11',
    techStack: '기술통계, SQL, Excel',
  },
  {
    id: 5,
    category: '비제조직군',
    module: '기술통계',
    title: '신제품 가입자 리텐션 지표 통계 요약 대시보드 구축',
    assignee: '윤서준',
    department: '서비스기획팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '주차별 가입자 활동 지표 기술통계 집계 및 시각화 리포트 구성',
    target: '신규 가입자 이탈율 지표 정밀 파악',
    period: '2026.10 ~ 2026.12',
    techStack: '기술통계, Tableau',
  },

  // 2. 추론통계 (5개)
  {
    id: 6,
    category: '제조직군',
    module: '추론통계',
    title: '설비 진동 신호 기반 고장 예지 보전(PdM) 유의성 검정',
    assignee: '이민호',
    department: '설비관리팀',
    status: '기획',
    mentor: '이영표',
    needsMentor: false,
    background: '주요 설비 회전체 진동 데이터의 상관관계 분석 및 모터 고장 인자 가설검정',
    target: '돌발 설비 정지 시간 연간 25시간 단축',
    period: '2026.09 ~ 2026.12',
    techStack: '추론통계, 가설검정, Python',
  },
  {
    id: 7,
    category: '제조직군',
    module: '추론통계',
    title: '신규 가열 공정 온도 변경 전후 인장강도 차이 가설검정',
    assignee: '강동원',
    department: '재질연구팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '신규 가열 공정 파라미터 적용에 따른 강도 차이 Paired t-test 분석',
    target: '인장강도 품질 유의성 입증',
    period: '2026.08 ~ 2026.11',
    techStack: '추론통계, Minitab',
  },
  {
    id: 8,
    category: '비제조직군',
    module: '추론통계',
    title: 'IT 서비스 UI 개편 A/B 테스트 전환율 통계적 유의성 검정',
    assignee: '이수진',
    department: 'UX디자인팀',
    status: '진행중',
    mentor: '류현진',
    needsMentor: false,
    background: '신규 구매 페이지 디자인 개편 후 결제 완료율 유의미성 비율 검정(Chi-Square)',
    target: '전환율 유의적 5% 상승 검증',
    period: '2026.08 ~ 2026.10',
    techStack: '추론통계, R, A/B Testing',
  },
  {
    id: 9,
    category: '비제조직군',
    module: '추론통계',
    title: '고객센터 상담 만족도 개선 정책 효과 가설검정',
    assignee: '한지민',
    department: 'CS기획팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '상담 가이드 개편 전후 CSAT 점수 평균 차이 t-test 검정 및 신뢰구간 산출',
    target: '상담 만족도 평균 1.2점 유의적 개선',
    period: '2026.07 ~ 2026.10',
    techStack: '추론통계, SPSS',
  },
  {
    id: 10,
    category: '비제조직군',
    module: '추론통계',
    title: '재무 수지 예측 및 예산 이상 지출 가설검정 자동 감지',
    assignee: '류지원',
    department: '재무회계팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '월별 사업부 예산 집행 항목의 통계적 이상치(Outlier) 감지 알고리즘',
    target: '이상 예지 집행 감지율 95% 달성',
    period: '2026.07 ~ 2026.10',
    techStack: '추론통계, Python',
  },

  // 3. 실험계획법 (5개)
  {
    id: 11,
    category: '제조직군',
    module: '실험계획법',
    title: '사출 성형 요인 최적화를 위한 DOE 다변량 실험계획',
    assignee: '최영희',
    department: '품질보증팀',
    status: '검증',
    mentor: '손흥민',
    needsMentor: false,
    background: '사출 압력, 온도, 속도 조합에 따른 치수 변형 최소화 도구로서 직교배열표 적용',
    target: '성형 수율 94.5% → 98.0% 개선',
    period: '2026.07 ~ 2026.10',
    techStack: '실험계획법(DOE), Minitab',
  },
  {
    id: 12,
    category: '제조직군',
    module: '실험계획법',
    title: '프레스 금형 타수 수명 단축 요인 DOE 실험 및 해석',
    assignee: '신동엽',
    department: '금형기술팀',
    status: '검증',
    mentor: '정전문가',
    needsMentor: false,
    background: '금형 마모 속도 최소화를 위한 윤활유 분사량 및 금형 간격 요인 실험',
    target: '금형 교체 주기 20% 연장',
    period: '2026.06 ~ 2026.09',
    techStack: '실험계획법, Minitab',
  },
  {
    id: 13,
    category: '제조직군',
    module: '실험계획법',
    title: '배터리 셀 도포 공정 최적 인자 도출 직교배열 실험',
    assignee: '배수지',
    department: '배터리공정팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '슬러리 코팅 속도 및 노즐 간격 요인에 대한 풀펙토리얼 실험 최적화',
    target: '도포 불량률 0.5% 이하 달성',
    period: '2026.09 ~ 2026.12',
    techStack: '실험계획법, Minitab',
  },
  {
    id: 14,
    category: '비제조직군',
    module: '실험계획법',
    title: 'HR 평가 가중치 최적화를 위한 DOE 실험계획 적용',
    assignee: '장동건',
    department: 'HRD팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '역량 평가 항목별 가중치 조절을 위한 시뮬레이션 기반 실험계획법 도출',
    target: '평가 신뢰도 및 수용성 향상',
    period: '2026.10 ~ 2026.12',
    techStack: '실험계획법, Excel DOE',
  },
  {
    id: 15,
    category: '비제조직군',
    module: '실험계획법',
    title: '디지털 마케팅 타겟팅 조합 최적화 다변량 DOE',
    assignee: '김태리',
    department: '디지털마케팅팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '광고 소재, 문구, 타겟 연령대 간 상호작용 분석을 위한 요인실험계획법',
    target: '광고 클릭률(CTR) 25% 증대',
    period: '2026.08 ~ 2026.11',
    techStack: '실험계획법, R',
  },

  // 4. 통계적공정관리 (5개)
  {
    id: 16,
    category: '제조직군',
    module: '통계적공정관리',
    title: '도장 공정 피막 두께 관리를 위한 SPC 관리도 구축',
    assignee: '정수진',
    department: '생산2팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '차량 도장 도막 두께 균일도 유지를 위한 Xbar-R 관리도 및 Cp/Cpk 공정능력 실시간 측정',
    target: 'Cpk 1.33 이상 확보 및 재작업 공정률 3% 미만 달성',
    period: '2026.08 ~ 2026.11',
    techStack: '통계적공정관리(SPC), Minitab',
  },
  {
    id: 17,
    category: '제조직군',
    module: '통계적공정관리',
    title: '도금 공정 액조 농도 자동 모니터링 및 Cpk 관리',
    assignee: '황유진',
    department: '표면처리팀',
    status: '진행중',
    mentor: '김마스터',
    needsMentor: false,
    background: '도금 액조 PH 및 약품 농도 실시간 측정 데이터 관리도 연동',
    target: '도금 변색 불량 제로화',
    period: '2026.07 ~ 2026.10',
    techStack: '통계적공정관리, SPC',
  },
  {
    id: 18,
    category: '제조직군',
    module: '통계적공정관리',
    title: '용입 깊이 균일도 수치 SPC 및 공정능력지수 평가',
    assignee: '이진욱',
    department: '품질검사팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '용접 비드 관통 심도 데이터 기반 P-관리도 모니터링 구축',
    target: '공정 산폐율 0.2% 미만 유지',
    period: '2026.08 ~ 2026.11',
    techStack: '통계적공정관리, Minitab',
  },
  {
    id: 19,
    category: '비제조직군',
    module: '통계적공정관리',
    title: '콜센터 평균 통화시간(AHT) 변동성 SPC 관리도 도입',
    assignee: '김혜수',
    department: '고객만족팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '상담시간 변동성 제어를 위한 I-MR 관리도 적용 및 공정 안정 상태 진단',
    target: '평균 처리시간 안정화 및 대기시간 단축',
    period: '2026.09 ~ 2026.12',
    techStack: '통계적공정관리, SPC, Excel',
  },
  {
    id: 20,
    category: '비제조직군',
    module: '통계적공정관리',
    title: '금융 데이터 처리 지연시간 관리 및 공정능력 평가',
    assignee: '조인성',
    department: '데이터운영팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '트랜잭션 승인 반응속도 수치 모니터링 및 99% Cpk 한계치 관리',
    target: '지연시간 100ms 이내 보장 비율 99.9%',
    period: '2026.10 ~ 2027.01',
    techStack: '통계적공정관리, Python',
  },

  // 5. 구조적문제해결방법론 (5개)
  {
    id: 21,
    category: '제조직군',
    module: '구조적문제해결방법론',
    title: '열처리 공정 재가공 비율 감소를 위한 6Sigma DMAIC 과제',
    assignee: '강동원',
    department: '제조기술팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '열처리 경도 불균일 원인에 대한 근본 원인 분석 및 8D 리포트 기반 구조적 개선',
    target: '열처리 재작업 비용 연간 4천만원 절감',
    period: '2026.09 ~ 2026.12',
    techStack: '구조적문제해결방법론, DMAIC',
  },
  {
    id: 22,
    category: '제조직군',
    module: '구조적문제해결방법론',
    title: '모터 소음 불량 근본원인 규명 8D 구조적 해결 과제',
    assignee: '오지호',
    department: '품질보증1팀',
    status: '진행중',
    mentor: '손흥민',
    needsMentor: false,
    background: '회전체 베어링 진동 소음 유발 원인 계통 분석 및 5-Why 구조적 방지책 수립',
    target: '소음 관련 클레임 80% 감소',
    period: '2026.08 ~ 2026.11',
    techStack: '구조적문제해결방법론, 8D Report',
  },
  {
    id: 23,
    category: '제조직군',
    module: '구조적문제해결방법론',
    title: '프레스 단조 공정 크랙 원인 규명 및 6시그마 문제해결',
    assignee: '박성웅',
    department: '단조기술팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '단조 금형 유효 응력 집중 구간 개선 및 DMAIC 방법론 기반 수율 최적화',
    target: '단조 크랙 발생률 0.1% 미만 달성',
    period: '2026.07 ~ 2026.10',
    techStack: '구조적문제해결방법론, DMAIC',
  },
  {
    id: 24,
    category: '비제조직군',
    module: '구조적문제해결방법론',
    title: '클레임 처리 프로세스 리드타임 단축 DMAIC 적용',
    assignee: '서현진',
    department: '고객지원팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '고객 불만 접수 후 최종 환불/교환 완료까지 병목 구간 6시그마 로직 분석',
    target: '처리 리드타임 7일 → 3일 단축',
    period: '2026.08 ~ 2026.11',
    techStack: '구조적문제해결방법론, DMAIC',
  },
  {
    id: 25,
    category: '비제조직군',
    module: '구조적문제해결방법론',
    title: '구매 정산 오류율 제로화를 위한 Root Cause 분석 과제',
    assignee: '유연석',
    department: '재무회계팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '세금계산서 입력 불일치 인자 Fishbone Diagram 및 5-Why 문제해결',
    target: '정산 정오율 99.8% 달성',
    period: '2026.07 ~ 2026.10',
    techStack: '구조적문제해결방법론, 5-Why',
  },

  // 6. 미니탭리터러시 (5개)
  {
    id: 26,
    category: '제조직군',
    module: '미니탭리터러시',
    title: '압출 라인 센서 데이터 품질 검증 및 회귀분석 모델링',
    assignee: '윤아름',
    department: '스마트팩토리팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: 'Minitab을 활용한 압출 압력과 제품 인두 강도 간 상호작용 및 다중회귀 분석',
    target: '불량 발생 예측 정확도 88% 확보',
    period: '2026.08 ~ 2026.10',
    techStack: '미니탭리터러시, Minitab',
  },
  {
    id: 27,
    category: '제조직군',
    module: '미니탭리터러시',
    title: 'Minitab 활용 칩 마운터 탑재 정밀도 통계 분석',
    assignee: '신하균',
    department: '정밀공정팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '표면장착기술(SMT) 칩 마운터 오차 데이터 미니탭 기술통계 및 정규성 검정',
    target: '장착 위치 오차 10㎛ 감소',
    period: '2026.09 ~ 2026.12',
    techStack: '미니탭리터러시, Minitab',
  },
  {
    id: 28,
    category: '제조직군',
    module: '미니탭리터러시',
    title: '열교환기 방열 성능 시험 수치 미니탭 요인 분석',
    assignee: '지성진',
    department: '열체계팀',
    status: '검증',
    mentor: '박지성',
    needsMentor: false,
    background: '방열판 소재 및 유량 설정별 방열 효율 미니탭 통계 그래프 분석',
    target: '최적 방열 효율 인자 선정',
    period: '2026.07 ~ 2026.10',
    techStack: '미니탭리터러시, Minitab',
  },
  {
    id: 29,
    category: '비제조직군',
    module: '미니탭리터러시',
    title: '미니탭 기반 B2B 영업 손익 수치 통계적 요약 보고',
    assignee: '김남길',
    department: '영업관리팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '고객사별 계약 규모 및 이익률 데이터를 미니탭 상자수염그림 및 요약 통계로 산출',
    target: '영업이익률 이상 거래 감지',
    period: '2026.08 ~ 2026.11',
    techStack: '미니탭리터러시, Minitab',
  },
  {
    id: 30,
    category: '비제조직군',
    module: '미니탭리터러시',
    title: '서비스 이용 지표 미니탭 산점도 및 상관관계 분석',
    assignee: '원빈',
    department: '서비스분석팀',
    status: '완료예정',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '체류시간과 유료 구독 전환 간 상관계수 미니탭 통계적 산출 및 리포팅',
    target: '핵심 전환 유발 지표 규명',
    period: '2026.06 ~ 2026.09',
    techStack: '미니탭리터러시, Minitab',
  },

  // 7. 파이썬리터러시 (5개)
  {
    id: 31,
    category: '제조직군',
    module: '파이썬리터러시',
    title: '용접 부위 비파괴 검사 결함 자동 통계 처리 스크립트',
    assignee: '임현우',
    department: '품질기술팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '파이썬 pandas/numpy를 활용한 초음파 비파괴 수집 데이터 자동 집계 파이프라인 구축',
    target: '품질 검사 보고서 작성 시간 80% 단축',
    period: '2026.09 ~ 2026.11',
    techStack: '파이썬리터러시, Pandas',
  },
  {
    id: 32,
    category: '제조직군',
    module: '파이썬리터러시',
    title: 'Python Pandas 활용 라인 센서 Log 데이터 자동 정제',
    assignee: '이광수',
    department: '스마트설비팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '초당 수만 건 발생하는 라인 로그 데이터 결측치 처리 및 파이썬 파이프라인 수립',
    target: '데이터 전처리 시간 연간 120시간 절감',
    period: '2026.08 ~ 2026.11',
    techStack: '파이썬리터러시, Python',
  },
  {
    id: 33,
    category: '제조직군',
    module: '파이썬리터러시',
    title: '금형 수명 모니터링 데이터 파이썬 크롤링 및 파싱',
    assignee: '김태원',
    department: '금형생산팀',
    status: '검증',
    mentor: '박찬호',
    needsMentor: false,
    background: '구형 설비 모니터 서버 텍스트 로그 파일 자동 수집 및 정형화 스크립트 작성',
    target: '금형 교체 타이밍 정밀 추적',
    period: '2026.07 ~ 2026.10',
    techStack: '파이썬리터러시, Python',
  },
  {
    id: 34,
    category: '비제조직군',
    module: '파이썬리터러시',
    title: '파이썬 수집 고객 서베이 텍스트 데이터 자동 집계',
    assignee: '박보영',
    department: '마케팅분석팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '설문조사 객관식/주관식 데이터 파이썬 자동 전처리 및 통계 리포트 출력',
    target: '설문 분석 보고서 자동화',
    period: '2026.08 ~ 2026.11',
    techStack: '파이썬리터러시, Pandas',
  },
  {
    id: 35,
    category: '비제조직군',
    module: '파이썬리터러시',
    title: '재무제표 수치 자동 추출 및 정량 분석 파이프라인',
    assignee: '조승우',
    department: '재무기획팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '엑셀 및 PDF 재무제표의 핵심 지표 자동 추출 및 파이썬 통계 지표 생성',
    target: '분기 결산 분석 정확도 향상',
    period: '2026.09 ~ 2026.12',
    techStack: '파이썬리터러시, Python',
  },

  // 8. 바이브코딩 (5개)
  {
    id: 36,
    category: '제조직군',
    module: '바이브코딩',
    title: '바이브코딩 기반 공정 현황 모니터링 웹 대시보드',
    assignee: '김선호',
    department: '생산시스템팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '바이브코딩 도구를 활용해 현장 라인 가동율을 한눈에 보는 웹 모니터링 화면 구축',
    target: '현장 가동 모니터링 신속화',
    period: '2026.08 ~ 2026.11',
    techStack: '바이브코딩, React',
  },
  {
    id: 37,
    category: '제조직군',
    module: '바이브코딩',
    title: '노코드/저코드 기반 품질 이슈 즉시 공유 모바일 앱',
    assignee: '남주혁',
    department: '품질기획팀',
    status: '검증',
    mentor: '이영표',
    needsMentor: false,
    background: '현장 품질 불량 발생 시 사진 촬영 및 즉시 알림 앱 프로토타입 작성',
    target: '불량 초동 전파 시간 10분 이내',
    period: '2026.07 ~ 2026.10',
    techStack: '바이브코딩, AppSheet',
  },
  {
    id: 38,
    category: '비제조직군',
    module: '바이브코딩',
    title: '구매 SCM 리드타임 분석 및 자재 수급 예측 웹앱',
    assignee: '홍길동',
    department: '구매물류팀',
    status: '작성중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '바이브코딩을 활용해 해외 자재 입고 지연 원인 시각화 및 리드타임 산출 프로토타입 개발',
    target: '자재 재고 안전유지비 8% 절감',
    period: '2026.09 ~ 2026.12',
    techStack: '바이브코딩, Python, Streamlit',
  },
  {
    id: 39,
    category: '비제조직군',
    module: '바이브코딩',
    title: 'HR 연차 신청 및 복지 포인트 통합 내부 대시보드',
    assignee: '신민아',
    department: '인사팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '사내 직원 복지 현황 및 연차 잔여일 확인 바이브코딩 웹 인터페이스 제작',
    target: '인사 문의 응대건수 30% 감소',
    period: '2026.08 ~ 2026.11',
    techStack: '바이브코딩, Web',
  },
  {
    id: 40,
    category: '비제조직군',
    module: '바이브코딩',
    title: '마케팅 캠페인 성과 측정 가상 시뮬레이터 앱',
    assignee: '이제훈',
    department: '디지털마케팅팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '예산 입력 시 기대 ROI 및 ROAS 가상 산출 인터랙티브 앱 구축',
    target: '마케팅 예산 편성 효율화',
    period: '2026.10 ~ 2026.12',
    techStack: '바이브코딩, Streamlit',
  },

  // 9. 머신러닝 이론 (5개)
  {
    id: 41,
    category: '제조직군',
    module: '머신러닝 이론',
    title: '원자재 투입량 최적화 및 수율 예측 분류 알고리즘',
    assignee: '오성민',
    department: '생산기획팀',
    status: '작성중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '원자재 배합율과 완제품 등급 간 머신러닝 분류 모델(Decision Tree/Random Forest) 적용',
    target: '원자재 손실률 5% 감축',
    period: '2026.10 ~ 2027.01',
    techStack: '머신러닝 이론, Scikit-Learn',
  },
  {
    id: 42,
    category: '제조직군',
    module: '머신러닝 이론',
    title: '센서 진동 가속도 데이터 기반 이상 상태 ML 분류기',
    assignee: '지창욱',
    department: '설비기술팀',
    status: '진행중',
    mentor: '박지성',
    needsMentor: false,
    background: 'SVM 및 Random Forest 알고리즘 기반 정상/주의/위험 상태 3단계 분류기 이론검증',
    target: '이상 탐지 F1-Score 0.92 달성',
    period: '2026.08 ~ 2026.11',
    techStack: '머신러닝 이론, Python',
  },
  {
    id: 43,
    category: '비제조직군',
    module: '머신러닝 이론',
    title: '고객 신용 등급 평가 및 대출 심사 ML 알고리즘 원리',
    assignee: '한효주',
    department: '리스크관리팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '로지스틱 회귀 및 Decision Tree 알고리즘을 활용한 신용 평가 분류 알고리즘 수립',
    target: '연체율 사전 예측률 향상',
    period: '2026.09 ~ 2026.12',
    techStack: '머신러닝 이론, Scikit-Learn',
  },
  {
    id: 44,
    category: '비제조직군',
    module: '머신러닝 이론',
    title: '사용자 세그멘테이션 K-Means 클러스터링 알고리즘',
    assignee: '이도현',
    department: '데이터전략팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '비지도학습 K-Means 알고리즘 적용을 통한 고객 구매 행동군 5개 군집화',
    target: '타겟 마케팅 효율 20% 상승',
    period: '2026.07 ~ 2026.10',
    techStack: '머신러닝 이론, Python',
  },
  {
    id: 45,
    category: '비제조직군',
    module: '머신러닝 이론',
    title: '상품 수요 변동 예측 시계열 Random Forest 모델',
    assignee: '김서형',
    department: 'SCM기획팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '계절성 요소 및 프로모션 인자를 포함한 머신러닝 회귀 모델링',
    target: '재고 과부족 오차율 10% 감소',
    period: '2026.08 ~ 2026.11',
    techStack: '머신러닝 이론, Scikit-Learn',
  },

  // 10. 탐색적데이터분석 (5개)
  {
    id: 46,
    category: '제조직군',
    module: '탐색적데이터분석',
    title: '소경 파이프 인두 인장강도 변수 EDA 및 불량 패턴 파악',
    assignee: '송지은',
    department: 'R&D 센터',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '원자재 성분 비율 및 환경 센서 데이터의 상관관계 시각화 및 EDA',
    target: '핵심 품질 영향 인자 3개 도출',
    period: '2026.08 ~ 2026.11',
    techStack: '탐색적데이터분석(EDA), Seaborn',
  },
  {
    id: 47,
    category: '제조직군',
    module: '탐색적데이터분석',
    title: '주조 공정 온도·습도·압력 변수 다변량 EDA 시각화',
    assignee: '임시완',
    department: '주조기술팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '센서 수집 다변량 데이터 히트맵 및 Pairplot을 통한 주조 기포 불량 인자 탐색',
    target: '기포 불량 발생 인자 규명',
    period: '2026.07 ~ 2026.10',
    techStack: '탐색적데이터분석, Matplotlib',
  },
  {
    id: 48,
    category: '비제조직군',
    module: '탐색적데이터분석',
    title: '채용 지원자 이력서 키워드 EDA 및 서류 스코어링',
    assignee: '안지영',
    department: '인재개발팀',
    status: '진행중',
    mentor: '최데이터',
    needsMentor: false,
    background: '역대 합격자 직무 역량 키워드 분포 분석 및 EDA 시각화',
    target: '서류 검토 시간 40% 단축',
    period: '2026.08 ~ 2026.11',
    techStack: '탐색적데이터분석, Text Mining',
  },
  {
    id: 49,
    category: '비제조직군',
    module: '탐색적데이터분석',
    title: '앱 사용자 유입 경로별 전환율 탐색적 데이터 분석',
    assignee: '박규영',
    department: 'UX연구팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '소셜 마케팅 채널별 유저 동선 로그 EDA 및 퍼널(Funnel) 지표 시각화',
    target: '주요 이탈 퍼널 구간 도출',
    period: '2026.08 ~ 2026.11',
    techStack: '탐색적데이터분석, Python',
  },
  {
    id: 50,
    category: '비제조직군',
    module: '탐색적데이터분석',
    title: '신규 상품 가격대별 매출 데이터 EDA 및 주효과 분석',
    assignee: '안효섭',
    department: '상품기획팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '가격 구간별 판매량 분포 EDA 및 이상 가격대 도출 시각화',
    target: '최적 가격 탄력성 구간 도출',
    period: '2026.09 ~ 2026.12',
    techStack: '탐색적데이터분석, Pandas',
  },

  // 11. 머신러닝 모델링 (5개)
  {
    id: 51,
    category: '제조직군',
    module: '머신러닝 모델링',
    title: 'AI 비전 검사기 외관 불량 자동 분류 분류기 구축',
    assignee: '정우성',
    department: 'SmartFactory팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '제품 표면 흠집 및 변색 이미지 분류를 위한 CNN/ResNet 모델 구축',
    target: '외관 불량 검사 자동화율 95%',
    period: '2026.08 ~ 2026.11',
    techStack: '머신러닝 모델링, PyTorch',
  },
  {
    id: 52,
    category: '제조직군',
    module: '머신러닝 모델링',
    title: '라인 설비 센서 이상 탐지 Random Forest 기반 예측 모델',
    assignee: '유아인',
    department: '스마트설비팀',
    status: '검증',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '설비 모터 수명 데이터 기반 XGBoost/Random Forest 고장 시점 예측',
    target: '예지 보전 오차율 5% 이내',
    period: '2026.07 ~ 2026.10',
    techStack: '머신러닝 모델링, XGBoost',
  },
  {
    id: 53,
    category: '비제조직군',
    module: '머신러닝 모델링',
    title: '고객 이탈 예측 및 차별화 마케팅 타겟팅 ML 모델',
    assignee: '서준호',
    department: '마케팅전략팀',
    status: '진행중',
    mentor: '류현진',
    needsMentor: false,
    background: '고객 행동 로그 및 구매 이력 데이터 기반 XGBoost 이탈 예측 모델 수립',
    target: '마케팅 이탈 방지 캠페인 ROI 30% 향상',
    period: '2026.08 ~ 2026.11',
    techStack: '머신러닝 모델링, XGBoost, Python',
  },
  {
    id: 54,
    category: '비제조직군',
    module: '머신러닝 모델링',
    title: 'B2B 교차 판매 가능성 예측 Gradient Boosting 모델',
    assignee: '김수현',
    department: '영업전략팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '기존 고객사의 추가 솔루션 도입 확률 계산 ML 파이프라인 수립',
    target: '교차 판매 성사율 18% 증가',
    period: '2026.09 ~ 2026.12',
    techStack: '머신러닝 모델링, LightGBM',
  },
  {
    id: 55,
    category: '비제조직군',
    module: '머신러닝 모델링',
    title: '물류 배송 지연 확률 예측 LightGBM 회귀 모델',
    assignee: '정해인',
    department: '물류운영팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '날씨, 교통량, 물동량 인자 기반 배송 지연 소요시간 예측',
    target: '지연 사전 안내 만족도 증대',
    period: '2026.08 ~ 2026.11',
    techStack: '머신러닝 모델링, Python',
  },

  // 12. AI Automation (5개)
  {
    id: 56,
    category: '제조직군',
    module: 'AI Automation',
    title: '설비 매뉴얼 Q&A 및 고장 조치 가이드 AI 챗봇 구축',
    assignee: '박해일',
    department: '설비보전팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '설비 매뉴얼 PDF 및 정비 이력 RAG 연동 고장 조치 AI 챗봇 개발',
    target: '설비 보전 조치 시간 30% 단축',
    period: '2026.08 ~ 2026.11',
    techStack: 'AI Automation, RAG, Gemini API',
  },
  {
    id: 57,
    category: '제조직군',
    module: 'AI Automation',
    title: '작업 표준서 자동 생성 및 표준 검토 AI 오케스트레이션',
    assignee: '이성민',
    department: '제조혁신팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '설계 변경사항 자동 감지 및 작업표준서 개정안 프롬프트 자동화',
    target: '작업표준서 개정 시간 70% 절감',
    period: '2026.09 ~ 2026.12',
    techStack: 'AI Automation, Python, LLM',
  },
  {
    id: 58,
    category: '비제조직군',
    module: 'AI Automation',
    title: 'LLM 기반 사내 업무 문서 자동 요약 및 워크플로우 자동화',
    assignee: '권보라',
    department: 'DX기획팀',
    status: '기획',
    mentor: '박찬호',
    needsMentor: false,
    background: '사내 보고서 및 메일 데이터 자동 분류, 요약 및 템플릿 생성을 위한 AI 프롬프트 오케스트레이션',
    target: '보고서 작성 단순 반복 업무 50% 단축',
    period: '2026.09 ~ 2026.12',
    techStack: 'AI Automation, Streamlit, Gemini API',
  },
  {
    id: 59,
    category: '비제조직군',
    module: 'AI Automation',
    title: '고객센터 문의 유형 자동 분류 및 챗봇 연동 파이프라인',
    assignee: '조현우',
    department: 'CS운영팀',
    status: '완료예정',
    mentor: '윤AI',
    needsMentor: false,
    background: 'VOC 고객 문의 접수 자동 태깅 및 FAQ 챗봇 연동 워크플로우 구축',
    target: '단순 문의 응대 시간 60% 절감',
    period: '2026.07 ~ 2026.10',
    techStack: 'AI Automation, Python',
  },
  {
    id: 60,
    category: '비제조직군',
    module: 'AI Automation',
    title: '이메일 자동 분류 및 정형 데이터 변환 AI 파이프라인',
    assignee: '김태리',
    department: 'DX전략팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '거래처 수발주 이메일 데이터 텍스트 구문 분석 및 DB 자동 적재',
    target: '수발주 입력 오류 0건 달성',
    period: '2026.08 ~ 2026.11',
    techStack: 'AI Automation, Python',
  },

  // 13. 시각화 (5개)
  {
    id: 61,
    category: '제조직군',
    module: '시각화',
    title: '클린룸 온습도 환경 센서 대시보드 구축',
    assignee: '배수지',
    department: '환경안전팀',
    status: '완료예정',
    mentor: '강코치',
    needsMentor: false,
    background: '반도체/전자 소재 클린룸 환경 실시간 모니터링 시각화',
    target: '환경 이탈 발생 시 초동 대응 시간 5분 이내 확보',
    period: '2026.07 ~ 2026.09',
    techStack: '시각화, Tableau',
  },
  {
    id: 62,
    category: '제조직군',
    module: '시각화',
    title: '전 생산 라인 실시간 수율 및 종합설비효율(OEE) 시각화',
    assignee: '하정우',
    department: '생산통합팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '라인별 가동률, 시간가동률, 성능가동률 실시간 통합 대시보드 구축',
    target: 'OEE 실시간 전파 및 라인 효율 5% 증대',
    period: '2026.08 ~ 2026.11',
    techStack: '시각화, Power BI',
  },
  {
    id: 63,
    category: '비제조직군',
    module: '시각화',
    title: '영업 실적 데이터 시각화 및 지역별 매출 대시보드',
    assignee: '문성진',
    department: '영업기획팀',
    status: '진행중',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '전국 사업장 및 품목별 매출 실적의 실시간 대시보드화 및 실적 모니터링',
    target: '월간 영업 보고서 작성 자동화',
    period: '2026.08 ~ 2026.10',
    techStack: '시각화, Tableau, SQL',
  },
  {
    id: 64,
    category: '비제조직군',
    module: '시각화',
    title: '경영진 전용 KPI 및 월간 실적 실시간 통합 대시보드',
    assignee: '김혜수',
    department: '경영기획팀',
    status: '완료예정',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '매출, 영업이익, 재고, 인력 현황 통합 리포트 시각화 차트 구축',
    target: '경영진 의사결정 시차 제로화',
    period: '2026.07 ~ 2026.09',
    techStack: '시각화, Tableau',
  },
  {
    id: 65,
    category: '비제조직군',
    module: '시각화',
    title: '글로벌 물류 배송 지점 지도 시각화 대시보드',
    assignee: '유재석',
    department: '글로벌SCM팀',
    status: '기획',
    mentor: '과제지도자 구함',
    needsMentor: true,
    background: '해외 거점 항구별 컨테이너 체류 기간 및 지연 지도 시각화',
    target: '체류 지연비용 10% 절감',
    period: '2026.09 ~ 2026.12',
    techStack: '시각화, Folium, Tableau',
  },
];

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
// PROJECT SPECIFICATION POPUP MODAL
// ==========================================

interface ProjectSpecModalProps {
  project: ProjectItem;
  currentUser: UserName;
  onClose: () => void;
  onConfirmApply: (projectId: number) => void;
}

export const ProjectSpecModal: React.FC<ProjectSpecModalProps> = ({
  project,
  currentUser,
  onClose,
  onConfirmApply,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleApplyClick = () => {
    onConfirmApply(project.id);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-indigo-600/30 rounded-xl border border-indigo-500/40 text-indigo-300 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                GDX 과제기술서 상세
              </span>
              <h3 className="text-sm sm:text-base font-black text-white leading-snug truncate">
                {project.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          {/* Metadata Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">직군 구분</span>
              <span className="font-extrabold text-slate-800 text-xs">{project.category}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">연계 모듈</span>
              <span className="font-extrabold text-indigo-700 text-xs">{project.module}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">담당자 / 부서</span>
              <span className="font-extrabold text-slate-800 text-xs truncate block">
                {project.assignee} 프로 ({project.department})
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">현재 진행 상황</span>
              <span className="font-bold text-blue-700 text-xs">{project.status}</span>
            </div>
          </div>

          {/* Detailed Spec Sections */}
          <div className="space-y-2.5 pt-0.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-xs">
                <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>📌 과제 배경 및 목적</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs pt-0.5">
                {project.background}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>🎯 과제 목표 및 기대효과</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-xs pt-0.5">
                {project.target}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-amber-700 font-bold text-xs">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>📅 수행 기간</span>
                </div>
                <p className="text-slate-800 font-extrabold text-xs pt-0.5">
                  {project.period}
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 space-y-1 shadow-2xs">
                <div className="flex items-center gap-1.5 text-purple-700 font-bold text-xs">
                  <Code2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>🛠️ 주요 적용 기술 / 모듈</span>
                </div>
                <p className="text-slate-800 font-extrabold text-xs pt-0.5">
                  {project.techStack}
                </p>
              </div>
            </div>
          </div>

          {/* Submission Feedback or Prompt */}
          {isSubmitted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/40 text-center space-y-1.5 animate-fadeIn mt-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm sm:text-base font-black text-emerald-900">
                과제지도 신청이 접수되었습니다.
              </h4>
              <p className="text-xs text-emerald-700">
                신청자: <strong>{currentUser} 프로</strong> 님 ({project.assignee} 프로 과제 지도 매칭 완료)
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-center space-y-0.5 mt-2">
              <p className="text-xs font-bold text-indigo-900">
                과제 지도 신청 안내
              </p>
              <p className="text-[11px] text-slate-600">
                과제지도자로 참여시 한 달간 주기적 멘토링이 지원되며 수석 마스터 평가 가점이 부여됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0">
          {isSubmitted ? (
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-7 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              확인 및 닫기
            </button>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleApplyClick}
                className="flex-1 sm:flex-initial px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>과제지도를 신청하시겠습니까?</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PROJECT MENTORING LIST MODAL
// ==========================================

interface ProjectMentoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModule?: ModuleId | null;
  currentUser: UserName;
  projects: ProjectItem[];
  onApplyMentor: (projectId: number) => void;
}

export const ProjectMentoringModal: React.FC<ProjectMentoringModalProps> = ({
  isOpen,
  onClose,
  initialModule = null,
  currentUser,
  projects,
  onApplyMentor,
}) => {
  const [activeCategory, setActiveCategory] = useState<'전체' | '제조직군' | '비제조직군'>('전체');
  const [selectedModule, setSelectedModule] = useState<ModuleId | 'ALL'>(initialModule || 'ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecProject, setSelectedSpecProject] = useState<ProjectItem | null>(null);
  const [appliedProjectIds, setAppliedProjectIds] = useState<number[]>([]);

  useEffect(() => {
    if (initialModule) {
      setSelectedModule(initialModule);
    } else {
      setSelectedModule('ALL');
    }
  }, [initialModule, isOpen]);

  if (!isOpen) return null;

  const manufacturingCount = projects.filter((p) => p.category === '제조직군').length;
  const nonManufacturingCount = projects.filter((p) => p.category === '비제조직군').length;

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === '제조직군' && p.category !== '제조직군') return false;
    if (activeCategory === '비제조직군' && p.category !== '비제조직군') return false;
    if (selectedModule !== 'ALL' && p.module !== selectedModule) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchAssignee = p.assignee.toLowerCase().includes(q);
      const matchDept = p.department.toLowerCase().includes(q);
      const matchMentor = p.mentor.toLowerCase().includes(q);
      const matchModule = p.module.toLowerCase().includes(q);
      return matchTitle || matchAssignee || matchDept || matchMentor || matchModule;
    }

    return true;
  });

  const handleConfirmApply = (projectId: number) => {
    onApplyMentor(projectId);
    setAppliedProjectIds((prev) => [...prev, projectId]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl border border-indigo-400/30 text-indigo-200 shadow-md">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-black text-white leading-tight">
                GDX 과제지도 알아보기 및 지도 신청
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-3.5 bg-slate-50/90 border-b border-slate-200 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-2xl border border-slate-300/60 text-xs font-bold">
            <button
              onClick={() => setActiveCategory('전체')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === '전체'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setActiveCategory('제조직군')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === '제조직군'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>제조직군</span>
            </button>
            <button
              onClick={() => setActiveCategory('비제조직군')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === '비제조직군'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>비제조직군</span>
            </button>
          </div>

          {/* Active Module Filter Indicator & Search input */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            {selectedModule !== 'ALL' && (
              <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-800 px-2.5 py-1.5 rounded-xl font-bold text-xs border border-indigo-200">
                <span>모듈: {selectedModule}</span>
                <button
                  onClick={() => setSelectedModule('ALL')}
                  className="p-0.5 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer text-indigo-600"
                  title="전체 모듈 보기"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="과제명, 담당자, 부서 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-800 text-xs rounded-xl pl-8 pr-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Project Table List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredProjects.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-600">검색된 과제가 없습니다.</p>
              <p className="text-xs text-slate-400">필터 조건을 변경하거나 검색어를 확인해주세요.</p>
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3.5 w-10 text-center">#</th>
                      <th className="py-3 px-3.5 min-w-[240px]">과제명</th>
                      <th className="py-3 px-3.5 w-28">담당자</th>
                      <th className="py-3 px-3.5 w-32">담당부서</th>
                      <th className="py-3 px-3.5 w-28">현재 진행 상황</th>
                      <th className="py-3 px-3.5 min-w-[190px] text-center">과제지도자</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {filteredProjects.map((project, idx) => {
                      const isNeedsMentor = project.needsMentor;
                      const isApplied = appliedProjectIds.includes(project.id) || project.mentor.includes(currentUser);

                      return (
                        <tr
                          key={project.id}
                          className="hover:bg-indigo-50/30 transition-colors group"
                        >
                          <td className="py-3.5 px-3.5 text-center font-semibold text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="py-3.5 px-3.5">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                    project.category === '제조직군'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  }`}
                                >
                                  {project.category}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                  {project.module}
                                </span>
                              </div>
                              <span className="font-extrabold text-slate-900 group-hover:text-indigo-800 text-xs sm:text-sm leading-snug">
                                {project.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-3.5 font-bold text-slate-800 whitespace-nowrap">
                            {project.assignee} 프로
                          </td>
                          <td className="py-3.5 px-3.5 text-slate-600 font-medium">
                            {project.department}
                          </td>
                          <td className="py-3.5 px-3.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                project.status === '진행중'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : project.status === '기획'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : project.status === '검증'
                                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                                  : project.status === '완료예정'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              {project.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                            {isNeedsMentor ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg shrink-0">
                                  과제지도자 구함
                                </span>
                                <button
                                  onClick={() => setSelectedSpecProject(project)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-2xs cursor-pointer shrink-0"
                                >
                                  <UserPlus className="w-3.5 h-3.5" />
                                  <span>과제지도 신청</span>
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold border border-slate-200 shadow-2xs">
                                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>{project.mentor}</span>
                                {isApplied && (
                                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded ml-0.5">
                                    (신청완료)
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500 font-medium hidden sm:block">
            💡 과제지도를 신청하시면 사무국에서 과제담당자의 의견을 수렴하여 매칭여부를 회신 드립니다.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-all ml-auto"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Project Spec Popup (과제기술서 정보 팝업) */}
      {selectedSpecProject && (
        <ProjectSpecModal
          project={selectedSpecProject}
          currentUser={currentUser}
          onClose={() => setSelectedSpecProject(null)}
          onConfirmApply={(pId) => {
            handleConfirmApply(pId);
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// BADGE MATRIX COMPONENT
// ==========================================

interface BadgeMatrixProps {
  currentUser: UserName;
  onOpenCriteria: () => void;
  onSelectModule: (id: ModuleId) => void;
  onOpenProjectMentoring: (moduleId?: ModuleId) => void;
}

export const BadgeMatrix: React.FC<BadgeMatrixProps> = ({
  currentUser,
  onOpenCriteria,
  onSelectModule,
  onOpenProjectMentoring,
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
                각 모듈별 배지 획득 현황(G2/G3 기준선)을 확인하고 수강신청 및 과제지도를 알아볼 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenProjectMentoring()}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>과제지도 현황</span>
            </button>

            <button
              onClick={onOpenCriteria}
              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>G2/G3 필수 기준선 상세 보기</span>
            </button>
          </div>
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

              {/* Requirement Summary & Dual Action Buttons */}
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

                {/* Dual Action Buttons */}
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    onClick={() => onSelectModule(moduleId)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-slate-100 border border-slate-700/50 rounded-xl text-[11px] font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer group/btn"
                    title="수강신청 알아보기"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-300 group-hover/btn:text-indigo-200 shrink-0" />
                    <span className="truncate">수강신청 알아보기</span>
                  </button>

                  <button
                    onClick={() => onOpenProjectMentoring(moduleId)}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700 border border-indigo-200/80 rounded-xl text-[11px] font-bold transition-all shadow-2xs hover:shadow-sm cursor-pointer group/btn"
                    title="과제지도 알아보기"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-600 group-hover/btn:text-indigo-700 shrink-0" />
                    <span className="truncate">과제지도 알아보기</span>
                  </button>
                </div>
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
  const [isMentoringModalOpen, setIsMentoringModalOpen] = useState<boolean>(false);
  const [mentoringTargetModule, setMentoringTargetModule] = useState<ModuleId | null>(null);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * USERS.length);
    setCurrentUser(USERS[randomIndex].name);
  }, []);

  const handleRandomUser = () => {
    const availableUsers = USERS.map((u) => u.name);
    const randomIndex = Math.floor(Math.random() * availableUsers.length);
    setCurrentUser(availableUsers[randomIndex]);
  };

  const handleOpenProjectMentoring = (moduleId?: ModuleId) => {
    setMentoringTargetModule(moduleId || null);
    setIsMentoringModalOpen(true);
  };

  const handleApplyMentor = (projectId: number) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            mentor: `${currentUser} 프로`,
            needsMentor: false,
          };
        }
        return p;
      })
    );
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
              onOpenProjectMentoring={handleOpenProjectMentoring}
            />
          </section>
        </main>
      )}

      <PromotionCriteriaModal
        isOpen={isCriteriaOpen}
        onClose={() => setIsCriteriaOpen(false)}
        currentUser={currentUser}
      />

      <ProjectMentoringModal
        isOpen={isMentoringModalOpen}
        onClose={() => setIsMentoringModalOpen(false)}
        initialModule={mentoringTargetModule}
        currentUser={currentUser}
        projects={projects}
        onApplyMentor={handleApplyMentor}
      />
    </div>
  );
}
