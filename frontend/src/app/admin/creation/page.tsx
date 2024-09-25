"use client";


const CreationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cadastro' | 'editor' | 'easyeditor'>('cadastro');

  };

  };

  return (
    <div className={styles.container}>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.switchButton} ${activeTab === 'cadastro' ? styles.active : ''}`}
            onClick={() => setActiveTab('cadastro')}
          >
            Cadastro
          </button>
          <button
            className={`${styles.switchButton} ${activeTab === 'editor' ? styles.active : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </button>
          <button
            className={`${styles.switchButton} ${activeTab === 'easyeditor' ? styles.active : ''}`}
            onClick={() => setActiveTab('easyeditor')}
          >
            Editor Fácil
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'cadastro' && (
            <>
              <h2 className={styles.title}>Cadastro</h2>
            </>
          )}

          {activeTab === 'editor' && (
              />
          )}

          {activeTab === 'easyeditor' && (
            <>
              <h2 className={styles.title}>Editor Fácil</h2>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationPage;
