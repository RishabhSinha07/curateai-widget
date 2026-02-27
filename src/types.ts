export interface ProductRecommendation {
  id: string;
  name: string;
  brand: string | null;
  price: number | null;
  currency: string;
  product_url: string | null;
  image_url: string | null;
  description: string | null;
  match_reasons: string[];
}

export interface ChatResponse {
  session_id: string;
  response: string;
  status: string;
  products: ProductRecommendation[];
  suggested_replies?: string[];
}

export interface ChatRequest {
  message: string;
  session_id?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: ProductRecommendation[];
  suggested_replies?: string[];
}

export interface CurateAIWidgetConfig {
  // Required
  apiUrl: string;

  // Auth
  authToken?: string;
  getAuthToken?: () => Promise<string> | string;

  // Cognito (built-in auth)
  cognitoUserPoolId?: string;
  cognitoClientId?: string;
  cognitoRegion?: string;
  requireAuth?: boolean;

  // Theme
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  userBubbleColor: string;
  assistantBubbleColor: string;
  textColor: string;
  textSecondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  headerGradient: string;

  // Layout
  position: 'bottom-right' | 'bottom-left';
  offsetX: number;
  offsetY: number;
  zIndex: number;
  width: number;
  height: number;
  bubbleSize: number;

  // Content
  title: string;
  subtitle: string;
  welcomeMessage: string;
  placeholder: string;
  poweredByText: string;
  poweredByUrl: string;

  // Icons (SVG strings or URLs)
  bubbleIcon?: string;
  headerIcon?: string;
  botAvatar?: string;

  // Behavior
  openOnLoad: boolean;
  persistSession: boolean;
  showPoweredBy: boolean;

  // Callbacks
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
  onProductClick?: (product: ProductRecommendation) => void;
}

export interface CurateAIPublicAPI {
  open: () => void;
  close: () => void;
  toggle: () => void;
  sendMessage: (text: string) => void;
  destroy: () => void;
}
