import cv2
import mediapipe as mp

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_holistic = mp.solutions.holistic

image = cv2.imread("ceshi.png", cv2.IMREAD_COLOR)
with mp_holistic.Holistic(
        min_detection_confidence=0.5,
        static_image_mode=True,
        min_tracking_confidence=0.5) as holistic:
        results = holistic.process(image)
        # 画图
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        mp_drawing.draw_landmarks(
            image,
            results.face_landmarks,
            mp_holistic.FACEMESH_CONTOURS,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles
                .get_default_face_mesh_contours_style())
        mp_drawing.draw_landmarks(
            image,
            results.pose_landmarks,
            mp_holistic.POSE_CONNECTIONS,
            landmark_drawing_spec=mp_drawing_styles
                .get_default_pose_landmarks_style())

        mp_drawing.draw_landmarks(image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
        mp_drawing.draw_landmarks(image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)

        # 右手21个节点坐标
        if results.right_hand_landmarks:
            for index, landmarks in enumerate(results.right_hand_landmarks.landmark):
                print(index, landmarks)
        # 鼻子坐标
        # print(results.pose_landmarks.landmark[mp_holistic.PoseLandmark.NOSE])
        cv2.imshow('MediaPipe Holistic', cv2.flip(image, 1))

