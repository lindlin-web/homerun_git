declare module DDSTL {
  class MinGameAdapter {
    public static getInstance(): MinGameAdapter;
    public getPlatform(): MINIGAME_PLATFORM;
    public onGameEnd(): void;
    public getSafeAreaSync(): Promise<SAFE_AREA>;
    public getMenuButtonBoundingClientRect(): BOUNDING_CLIENTRECT;
    public showLog(message: string, isAlert?: boolean): void;
    public getSystemInfoSync(): Promise<any>;
    public getIsIOSModel(): Promise<boolean>;
  }
  /**
   * 矩形范围（界面安全区域）
   */
  class SAFE_AREA {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  }
  /**
   * 矩形范围（胶囊按钮区域）
   */
  class BOUNDING_CLIENTRECT {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
  }
  /**
   * 窗口信息
   */
  class WINDOW_INFO {
    pixelRatio: number;
    screenWidth: number;
    screenHeight: number;
    windowWidth: number;
    windowHeight: number;
    statusBarHeight: number;
    safeArea: SAFE_AREA;
    screenTop: number;
  }
  /**
   * 平台枚举
   */
  enum MINIGAME_PLATFORM {
    NON,
    WX,
  }
}
