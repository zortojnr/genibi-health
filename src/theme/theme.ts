// Web-compatible theme without react-native-paper dependency
export const theme = {
  colors: {
    primary: '#4A90E2',      // Calming blue
    secondary: '#7ED321',     // Positive green
    accent: '#F5A623',        // Warm orange
    background: '#F8F9FA',    // Light gray background
    surface: '#FFFFFF',       // White surface
    text: '#2C3E50',         // Dark blue-gray text
    placeholder: '#95A5A6',   // Light gray placeholder
    error: '#E74C3C',        // Red for errors
    success: '#27AE60',      // Green for success
    warning: '#F39C12',      // Orange for warnings
    info: '#3498DB',         // Blue for info
    
    // Mental health specific colors
    calm: '#E8F4FD',         // Very light blue for calm sections
    support: '#FFF3E0',      // Light orange for support sections
    emergency: '#FFEBEE',    // Light red for emergency sections
    wellness: '#F1F8E9',     // Light green for wellness sections
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 8,
    },
  },
};
