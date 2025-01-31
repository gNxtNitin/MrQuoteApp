import { SQLiteVariadicBindParams } from 'expo-sqlite';
import { openDatabase } from '../../services/database/init';
import * as SQLite from 'expo-sqlite';
import { Report } from './Report';
import { Pages } from './Pages';
import { Layouts, LayoutsData } from './Layouts';
import { LayoutPages, LayoutPagesData } from './LayoutPages';
import { TitlePageContent, TitlePageContentData } from './TitlePageContent';
import { IntroductionPageContent, IntroductionPageContentData } from './IntroductionPageContent';
import { ReportPages } from './ReportPages';
import { InspectionPageContent, InspectionPageContentData } from './InspectionPageContent';
import { InspectionPageSection, InspectionPageSectionData } from './InspectionPageSection';
import { InspectionSectionItems, InspectionSectionItemsData } from './InspectionSectionItems';
import { Canvas } from './Canvas';
import { QuotePageContent, QuotePageContentData } from './QuotePageContent';
import { QuotePageSection, QuotePageSectionData } from './QuotePageSection';
import { QuotePagePriceSection, QuotePagePriceSectionData } from './QuotePagePriceSection';
import { AuthorizationPageContent, AuthorizationPageContentData } from './AuthorizationPageContent';
import { AuthPagePriceSection, AuthPagePriceSectionData } from './AuthPagePriceSection';
import { AuthPrimarySigner, AuthPrimarySignerData } from './AuthPrimarySigner';
import { AuthProductSelection, AuthProductSelectionData } from './AuthProductSelection';
import { TermConditionsPageContent, TermConditionsPageContentData } from './TermConditionsPageContent';

const db = openDatabase();

interface ColumnDefinition {
  type: string;
}

interface EstimateColumns {
  id: ColumnDefinition;
  company_id: ColumnDefinition;
  user_id: ColumnDefinition;
  estimate_name: ColumnDefinition;
  description: ColumnDefinition;
  estimate_status: ColumnDefinition;
  is_active: ColumnDefinition;
  created_by: ColumnDefinition;
  created_date: ColumnDefinition;
  modified_by: ColumnDefinition;
  modified_date: ColumnDefinition;
}

export interface EstimateData {
  id?: number;
  company_id?: number;
  user_id?: number;
  estimate_name?: string;
  description?: string;
  estimate_status?: string;
  is_active?: boolean;
  created_by?: number;
  created_date?: string;
  modified_by?: number;
  modified_date?: string;
}

export async function duplicateDefaultLayout(
  companyId: number,
  estimateName: string,
  userId: number,
  layout:LayoutsData | null,
  db: SQLite.SQLiteDatabase
): Promise<number | null> {
  try {

    if (!layout?.id) {
      // console.log.log('No default layout found for company:', companyId);
      return null;
    }

    // Create new page
    await Pages.insert({
      page_name: estimateName,
      description: `Page for estimate ${estimateName}`,
      is_template: false,
      is_active: true,
      created_by: userId,
      modified_by: userId
    });

    // Get the new page ID
    const newPageResult = await db.getFirstAsync<{ id: number }>(
      'SELECT last_insert_rowid() as id'
    );
    const newPageId = newPageResult?.id;
    // console.log.log('New page ID:', newPageId);

    if (!newPageId) {
      // console.log.log('Failed to get new page ID');
      return null;
    }

    // Find layout pages for default layout
    const layoutPage = await db.getFirstAsync<LayoutPagesData>(
      `SELECT * FROM ${LayoutPages.tableName} WHERE layout_id = ?`,
      [layout.id]
    );
    // console.log.log('Layout page:', layoutPage);
    // for (const layoutPage of layoutPages) {
      if (!layoutPage?.page_id) {
        // console.log.log('Layout page has no page_id:', layoutPage);
        return null;
      }

      // Find and duplicate title page content
      const titlePage = await db.getFirstAsync<TitlePageContentData>(
        `SELECT * FROM ${TitlePageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Title page:', titlePage);
      if (titlePage) {
        await TitlePageContent.insert({
          id: undefined,
          page_id: newPageId,
          report_type: titlePage.report_type,
          title_name: titlePage.title_name,
          date: titlePage.date,
          primary_image: titlePage.primary_image,
          certification_logo: titlePage.certification_logo,
          first_name: titlePage.first_name,
          last_name: titlePage.last_name,
          company_name: titlePage.company_name,
          address: titlePage.address,
          city: titlePage.city,
          state: titlePage.state,
          zip_code: titlePage.zip_code,
          created_by: userId,
          modified_by: userId,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString()
        });
        // console.log.log('Title page content duplicated');
      }

      // Find and duplicate introduction page content
      const introPage = await db.getFirstAsync<IntroductionPageContentData>(
        `SELECT * FROM ${IntroductionPageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Introduction page:', introPage);

      if (introPage) {
        await IntroductionPageContent.insert({
          id: undefined,
          page_id: newPageId,
          introduction_name: introPage.introduction_name,
          introduction_content: introPage.introduction_content,
          is_active: introPage.is_active,
          created_by: userId,
          modified_by: userId,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString()
        });
        // console.log.log('Introduction page content duplicated');
      }

      // 3. Find and duplicate inspection page content
      const inspectionPage = await db.getFirstAsync<InspectionPageContentData>(
        `SELECT * FROM ${InspectionPageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Inspection page:', inspectionPage);
      if (inspectionPage) {
        await InspectionPageContent.insert({
          id: undefined,
          page_id: newPageId,
          inspection_title: inspectionPage.inspection_title,
          is_active: true,
          created_by: userId,
          modified_by: userId,
          created_date: new Date().toISOString(),
          modified_date: new Date().toISOString()
        });
        // console.log.log('Inspection page content duplicated');
        const newInspectionPageId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
          // console.log.log('New inspection page ID:', newInspectionPageId);
        // 3a. Find and duplicate inspection sections
        const inspectionSections = await db.getAllAsync<InspectionPageSectionData>(
          `SELECT * FROM ${InspectionPageSection.tableName} WHERE inspection_page_id = ?`,
          [inspectionPage.id!]
        );
        // console.log.log('Inspection sections:', inspectionSections);
        for (const section of inspectionSections) {
           await InspectionPageSection.insert({
            id: undefined,
            inspection_page_id: newInspectionPageId!.id,
            section_style_id: section.section_style_id,
            section_title: section.section_title,
            is_active: true,
            created_by: userId,
            modified_by: userId
          });
          // console.log.log('Inspection section duplicated');
          const newSectionId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
          // console.log.log('New section ID:', newSectionId);
          // 3b. Find and duplicate inspection items
          const items = await db.getAllAsync<InspectionSectionItemsData>(
            `SELECT * FROM ${InspectionSectionItems.tableName} WHERE inspection_section_id = ?`,
            [section.id!]
          );
          // console.log.log('Inspection items:', items);
          for (const item of items) {
            await InspectionSectionItems.insert({
              id: undefined,
              inspection_section_id: newSectionId!.id,
              inspection_file: item.inspection_file,
              inspection_content: item.inspection_content,
              is_active: true,
              created_by: userId,
              modified_by: userId
            });
            // console.log.log('Inspection item duplicated');
          }
        }
      }

      // 4. Create blank canvas
      await Canvas.insert({
        page_id: newPageId,
        paths: '[]',
        current_path: '',
        description: '',
        created_by: userId,
        created_date: new Date().toISOString(),
        is_active: true
      });
      // console.log.log('Canvas created successfully');
      // 5. Find and duplicate quote page content
      const quotePage = await db.getFirstAsync<QuotePageContentData>(
        `SELECT * FROM ${QuotePageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Quote page:', quotePage);
      if (quotePage) {
        await QuotePageContent.insert({
          id: undefined,
          page_id: newPageId,
          quote_page_title: quotePage.quote_page_title,
          quote_subtotal: quotePage.quote_subtotal,
          total: quotePage.total,
          notes: quotePage.notes,
          is_active: true,
          created_by: userId,
          modified_by: userId
        });
        // console.log.log('Quote page content duplicated');
        const newQuotePageId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
          // console.log.log('New quote page ID:', newQuotePageId);
        // 5a. Find and duplicate quote sections
        const quoteSections = await db.getAllAsync<QuotePageSectionData>(
          `SELECT * FROM ${QuotePageSection.tableName} WHERE quote_page_id = ?`,
          [quotePage.id!]
        );
        // console.log.log('Quote page section:', quoteSections);
        for (const section of quoteSections) {
          await QuotePageSection.insert({
            id: undefined,
            quote_page_id: newQuotePageId!.id,
            section_title: section.section_title,
            section_total: section.section_total,
            is_active: true,
            created_by: userId,
            modified_by: userId
          });
          // console.log.log('Quote page section duplicated');
          const newSectionId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
          // console.log.log('New section ID:', newSectionId);
          // 5b. Find and duplicate quote price sections
          const priceSections = await db.getAllAsync<QuotePagePriceSectionData>(
            `SELECT * FROM ${QuotePagePriceSection.tableName} WHERE quote_section_id = ?`,
            [section.id!]
          );
          // console.log.log('Quote page price section:', priceSections);
          for (const priceSection of priceSections) {
            await QuotePagePriceSection.insert({
              id: undefined,
              quote_section_id: newSectionId!.id,
              price_section_id: priceSection.price_section_id,
              section_total: priceSection.section_total,
              is_active: true,
              created_by: userId,
              modified_by: userId
            });
            // console.log.log('Quote page price section duplicated');
          }
        }
      }

      // 6. Find and duplicate authorization page content
      const authPage = await db.getFirstAsync<AuthorizationPageContentData>(
        `SELECT * FROM ${AuthorizationPageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Authorization page:', authPage);
      if (authPage) {
        await AuthorizationPageContent.insert({
          id: undefined,
          page_id: newPageId,
          authorization_page_title: authPage.authorization_page_title,
          disclaimer: authPage.disclaimer,
          section_title: authPage.section_title,
          footer_notes: authPage.footer_notes,
          is_active: true,
          created_by: userId,
          modified_by: userId
        });
        // console.log.log('Authorization page content duplicated');
        const newAuthPageId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
        // console.log.log('New authorization page ID:', newAuthPageId);
        // 6a. Find and duplicate auth price sections
        const authPriceSections = await db.getAllAsync<AuthPagePriceSectionData>(
          `SELECT * FROM ${AuthPagePriceSection.tableName} WHERE authorization_page_id = ?`,
          [authPage.id!]
        );
        // console.log.log('Auth price section:', authPriceSections);
        for (const priceSection of authPriceSections) {
          await AuthPagePriceSection.insert({
            id: undefined,
            authorization_page_id: newAuthPageId!.id,
            price_section_id: priceSection.price_section_id,
            section_total: priceSection.section_total,
            is_active: true,
            created_by: userId,
            modified_by: userId
          });
          // console.log.log('Auth price section duplicated');
        }

        // 6b. Find and duplicate auth primary signer
        const signer = await db.getFirstAsync<AuthPrimarySignerData>(
          `SELECT * FROM ${AuthPrimarySigner.tableName} WHERE authorization_page_id = ?`,
          [authPage.id!]
        );
        // console.log.log('Auth primary signer:', signer);
        if (signer) {
          await AuthPrimarySigner.insert({
            auth_p_signer_id: undefined,
            authorization_page_id: newAuthPageId!.id,
            first_name: signer.first_name,
            last_name: signer.last_name,
            email_address: signer.email_address,
            is_active: true,
            created_by: userId,
            modified_by: userId
          });
          // console.log.log('Auth primary signer duplicated');
        }

        // 6c. Find and duplicate auth product selections
        const products = await db.getAllAsync<AuthProductSelectionData>(
          `SELECT * FROM ${AuthProductSelection.tableName} WHERE authorization_page_id = ?`,
          [authPage.id!]
        );
        // console.log.log('Auth product selection:', products);
        for (const product of products) {
          await AuthProductSelection.insert({
            id: undefined,
            authorization_page_id: newAuthPageId!.id,
            item: product.item,
            selection: product.selection,
            is_active: true,
            created_by: userId,
            modified_by: userId
          });
          // console.log.log('Auth product selection duplicated');
        }
      }

      // 7. Find and duplicate terms and conditions page content
      const termsPage = await db.getFirstAsync<TermConditionsPageContentData>(
        `SELECT * FROM ${TermConditionsPageContent.tableName} WHERE page_id = ?`,
        [layoutPage.page_id]
      );
      // console.log.log('Terms and conditions page:', termsPage);

      if (termsPage) {
        await TermConditionsPageContent.insert({
          id: undefined,
          page_id: newPageId,
          tc_page_title: termsPage.tc_page_title,
          is_acknowledged: termsPage.is_acknowledged,
          is_summary: termsPage.is_summary,
          is_pdf: termsPage.is_pdf,
          summary_content: termsPage.summary_content,
          pdf_file_path: termsPage.pdf_file_path,
          is_active: true,
          created_by: userId,
          modified_by: userId
        });
        // console.log.log('Terms and conditions page content duplicated');
      }
    // }

    return newPageId;
  } catch (error) {
    console.error('Error in duplicateDefaultLayout:', error);
    throw error;
  }
}

export const Estimate = {
  tableName: 'estimate',
  columns: {
    id: { type: 'INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE' },
    company_id: { type: 'INTEGER' },
    user_id: { type: 'INTEGER' },
    estimate_name: { type: 'TEXT' },
    description: { type: 'TEXT' },
    estimate_status: { type: 'TEXT' },
    is_active: { type: 'BOOLEAN DEFAULT true' },
    created_by: { type: 'INTEGER' },
    created_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' },
    modified_by: { type: 'INTEGER' },
    modified_date: { type: 'DATETIME DEFAULT CURRENT_TIMESTAMP' }
  } as EstimateColumns,

  createTable: async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS ${Estimate.tableName} (
      ${Object.entries(Estimate.columns)
        .map(([key, value]) => `${key} ${value.type}`)
        .join(',\n')},
        FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (modified_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;
    try {
      await db.execAsync(query);
    } catch (error) {
      console.error('Error creating estimate table:', error);
      throw error;
    }
  },
  
  insert: async (estimateData: EstimateData):Promise<number | null> => {
    const db = openDatabase();
    
    try {
      // Insert Estimate
      const keys = Object.keys(estimateData);
      const values = Object.values(estimateData);
      const placeholders = values.map(() => '?').join(',');

      const statement = await db.prepareAsync(
        `INSERT INTO ${Estimate.tableName} (${keys.join(',')}) VALUES (${placeholders})`
      );

      try {
        await statement.executeAsync(values);
        // console.log.log('Estimate inserted successfully');
        
        // Get the inserted estimate's ID
        const result = await db.getFirstAsync<{ id: number }>(
          'SELECT last_insert_rowid() as id'
        );
        const estimateId = result!.id;
        // console.log.log('Estimate ID:', estimateId);

        if (estimateId && estimateData.company_id) {
                const defaultLayout: LayoutsData | null = await db.getFirstAsync<LayoutsData>(
                    `SELECT * FROM ${Layouts.tableName} 
                    WHERE company_id = ? AND is_default = true AND is_active = true 
                    LIMIT 1`,
                    [estimateData.company_id]
                );
          // Create corresponding Report
          await Report.insert({
            estimate_id: estimateId,
            layout_id: defaultLayout?.id,
            report_name: estimateData.estimate_name,
            description: estimateData.description,
            report_status: 'Open',
            is_active: true,
            created_by: estimateData.created_by,
            modified_by: estimateData.modified_by
          });
          // console.log.log("layout_id", defaultLayout?.id);
          // console.log.log('Report created successfully');
          const reportId = await db.getFirstAsync<{ id: number }>(
            'SELECT last_insert_rowid() as id'
          );
          // Duplicate layout and create pages
          if (estimateData.estimate_name && estimateData.created_by) {
            
            const newPageId = await duplicateDefaultLayout(
              estimateData.company_id,
              estimateData.estimate_name,
              estimateData.created_by,
              defaultLayout,
              db
            );
            // console.log.log('New page created with ID:', newPageId);
            if (newPageId) {
              // console.log.log('Report ID:', reportId);
              await ReportPages.insert({
                report_id: reportId?.id,
                page_id: newPageId,
                is_active: true,
                created_by: estimateData.created_by,
                modified_by: estimateData.modified_by
              });
              // console.log.log('Report page created successfully');
            }
          }
        }
        return estimateId;
      } finally {
        await statement.finalizeAsync();
      }
    } catch (error) {
      console.error('Error in Estimate insert:', error);
      throw error;
    }
  },

  getById: async (id: number): Promise<EstimateData | null> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} WHERE id = ?`
    );

    try {
      const result = await statement.executeAsync([id]);
      return await result.getFirstAsync() || null;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByCompanyId: async (companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUserAndCompany: async (userId: number, companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND user_id = ?
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId, userId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  },

  update: async (id: number, data: Partial<EstimateData>) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const statement = await db.prepareAsync(
      `UPDATE ${Estimate.tableName} SET ${setClause} WHERE id = ?`
    );

    try {
      await statement.executeAsync([...values, id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  delete: async (id: number) => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Estimate.tableName} WHERE id = ?`
    );

    try {
      await statement.executeAsync([id]);
    } finally {
      await statement.finalizeAsync();
    }
  },

  deleteAll: async () => {
    const statement = await db.prepareAsync(
      `DELETE FROM ${Estimate.tableName}`
    );

    try {
      await statement.executeAsync();
      // console.log.log('All estimates deleted successfully');
    } finally {
      await statement.finalizeAsync();
    }
  },

  getLastInsertedId: async (): Promise<number> => {
    const statement = await db.prepareAsync(
      'SELECT last_insert_rowid() as id FROM estimate'
    );
    try {
      const result = await statement.executeAsync();
      return await result.getFirstAsync() as number;
    } finally {
      await statement.finalizeAsync();
    }
  },

  getByUserAndCompanyId: async (userId: number, companyId: number): Promise<EstimateData[]> => {
    const statement = await db.prepareAsync(
      `SELECT * FROM ${Estimate.tableName} 
       WHERE company_id = ? 
       AND user_id = ?
       AND is_active = true
       ORDER BY created_date DESC`
    );

    try {
      const result = await statement.executeAsync([companyId, userId]);
      return await result.getAllAsync() as EstimateData[];
    } finally {
      await statement.finalizeAsync();
    }
  }
} as const; 