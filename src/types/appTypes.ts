// types/api.ts

// --- ENUMS & BASE ---

export type UserType = "Student" | "Business" | "Admin" | number;

// --- AUTHENTICATION ---

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  userType: string;
  verificationStatus: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  userType: UserType;
  firstName?: string | null;
  lastName?: string | null;
  programme?: string | null;
  companyName?: string | null;
  studentNumber?: string | null;
}

// --- USER PROFILES ---

export interface ProfileDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  programme: string;
  headline?: string | null;
  bio?: string | null;
  cvFileUrl?: string | null;
  experiences?: ExperienceDto[];
  certifications?: CertificationDto[];
  skills?: SkillDto[];
}

export interface CreateProfileDto {
  firstName?: string;
  lastName?: string;
  studentNumber?: string;
  programme?: string;
  headline?: string;
  bio?: string;

  companyName: string;
  registrationNumber: string;
  industry?: string;
  websiteUrl?: string;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  studentNumber: string;
  headline: string;
  bio: string;
  programme: string;
}

export interface UserProfileDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  bio: string;
  programme: string;
  studentNumber: string;
}

export interface DetailedUserProfileDto {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  programme: string;
  systemHeadline: string;
  aboutBio: string;
  cvFileUrl: string;
  experiences: ExperienceDto[];
  certifications: CertificationDto[];
  skills: SkillDto[];
}

// --- EXPERIENCES ---

export interface AddExperienceDto {
  title: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

export interface ExperienceDto {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

// --- CERTIFICATIONS ---

export interface AddCertificationDto {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl: string;
}

export interface CertificationDto {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl: string;
}

// --- SKILLS ---

export interface SkillDto {
  id: string;
  name: string;
}

export interface CreateSkillDto {
  name: string;
}

// --- BUSINESS PROFILES ---

export interface BusinessProfileDto {
  id: string;
  companyName: string;
  industry: string;
  websiteUrl: string;
}

export interface CreateBusinessDto {
  companyName: string;
  registrationNumber: string;
  industry: string;
  websiteUrl: string;
}

// --- POSTS & SOCIAL ---

export interface PostDto {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  firstName: string;
  lastName: string;
  userEmail: string;
  isLiked: boolean
}

// --- DIRECT MESSAGING ---

export interface DirectMessageDto {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

export interface SendMessageDto {
  receiverId: string;
  content: string;
}

export interface MarkAsReadDto {
  messageIds: string[];
}

// --- OPPORTUNITIES & JOBS ---

export interface CreateOpportunityDto {
  title: string;
  description: string;
  targetProgramme: string;
}

export interface ApplyJobDto {
  cvFileUrl: string;
}

// --- EVENTS ---

export interface EventDto {
  id: string;
  title: string;
  description: string;
  eventDate: string;
}

export interface CreateEventDto {
  title: string;
  description: string;
  eventDate: string;
}

// --- EMAILS ---

export interface EmailRequest {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string | null;
  from?: string | null;
}
// Add to types/api.ts

export interface CreatePostRequest {
  content: string;
}

export interface AddCommentRequest {
  content: string;
}

export interface ToggleReactionRequest {
  reactionType: string;
}